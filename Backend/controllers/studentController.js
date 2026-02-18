const Student = require("../models/Student");
const GatePassRequest = require("../models/GatePassRequest");
const Counter = require("../models/Counter");
const { getImportanceFromML } = require("../services/mlService");

/* ================= STUDENT DASHBOARD ================= */
exports.getStudentDashboard = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({
      message: "Failed to load student dashboard",
      error: error.message
    });
  }
};

/* ================= APPLY GATE PASS ================= */
exports.applyGatePass = async (req, res) => {
  try {
    console.log("🔥 APPLY GATE PASS BODY:", req.body);

    const student = await Student.findById(req.user.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // ✅ BACKWARD-COMPATIBLE EXTRACTION
    const {
      reason,
      outTime,
      durationHours,
      duration // fallback
    } = req.body;

    const finalDurationHours = Number(durationHours || duration);

    if (!reason || !outTime || !finalDurationHours) {
      return res.status(400).json({
        message: "Reason, out time and duration are required"
      });
    }

    // 🤖 ML PRIORITY PREDICTION
    const priority = await getImportanceFromML(reason);

    // ⏰ Convert outTime to minutes
    const [hours, minutes] = outTime.split(":").map(Number);
    const outTimeInMinutes = hours * 60 + minutes;

    // ⏳ Duration in minutes
    const durationInMinutes = finalDurationHours * 60;
    const endTimeInMinutes = outTimeInMinutes + durationInMinutes;

    // 🏫 College end time → 4:30 PM
    const COLLEGE_END_TIME = 16 * 60 + 30;

    let isWholeDay = false;
    let expectedReturnTime = null;
    let durationLabel = `${finalDurationHours} Hours`;

    if (endTimeInMinutes >= COLLEGE_END_TIME) {
      isWholeDay = true;
      durationLabel = "Whole Day";
    } else {
      const endHours = Math.floor(endTimeInMinutes / 60);
      const endMinutes = endTimeInMinutes % 60;

      expectedReturnTime = `${String(endHours).padStart(2, "0")}:${String(
        endMinutes
      ).padStart(2, "0")}`;
    }

    // 🔢 Generate Gate Pass ID
    const counter = await Counter.findOneAndUpdate(
      { name: "gatepass" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const year = new Date().getFullYear();
    const requestId = `GP-${year}-${String(counter.seq).padStart(6, "0")}`;

    const gatePass = await GatePassRequest.create({
      requestId,
      student: {
        rollNo: student.rollNo,
        name: student.name,
        branch: student.branch,
        section: student.section,
        year: student.year
      },
      reason,
      outTime,
      durationHours: finalDurationHours,
      durationLabel,
      expectedReturnTime,
      isWholeDay,
      priority, // 🤖 ML RESULT SAVED HERE
      status: "Pending",
      appliedDate: new Date().toISOString().split("T")[0]
    });

    res.status(201).json({
      success: true,
      message: "Gate pass applied successfully",
      gatePass
    });
  } catch (error) {
    console.error("❌ APPLY GATE PASS ERROR:", error);
    res.status(500).json({
      message: "Gate pass apply failed",
      error: error.message
    });
  }
};

/* ================= STUDENT GATE PASSES ================= */
exports.getStudentGatePasses = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);

    const gatepasses = await GatePassRequest.find({
      "student.rollNo": student.rollNo
    }).sort({ createdAt: -1 });

    res.json(gatepasses);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch gate passes",
      error: error.message
    });
  }
};
