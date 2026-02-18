const GatePassRequest = require("../models/GatePassRequest");
const Student = require("../models/Student");

/* ================= PENDING REQUESTS ================= */
exports.getPendingRequests = async (req, res) => {
  try {
    const requests = await GatePassRequest.find({
      "coordinator.decision": "Pending",
      status: "Pending"
    });

    const updatedRequests = await Promise.all(
      requests.map(async (reqItem) => {
        const student = await Student.findOne(
          { rollNo: reqItem.student.rollNo },
          "photo"
        );

        return {
          ...reqItem.toObject(),
          student: {
            ...reqItem.student,
            photo: student?.photo || ""
          }
        };
      })
    );

    res.json(updatedRequests);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch coordinator requests" });
  }
};

/* ================= TAKE ACTION ================= */
exports.takeAction = async (req, res) => {
  try {
    const { decision, remarks } = req.body;

    // ✅ FIXED: use requestId ONLY
    const request = await GatePassRequest.findOne({
      requestId: req.params.requestId
    });

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.coordinator.decision = decision;
    request.coordinator.decisionDate = new Date();
    request.coordinator.remarks = remarks;

    if (decision === "Rejected") {
      request.status = "Rejected by Coordinator";

      request.hod.decision = "Pending";
      request.hod.decisionDate = null;
      request.hod.remarks = null;
    }

    if (decision === "Approved") {
      request.status = "Pending";
    }

    await request.save();

    res.json({
      success: true,
      message:
        decision === "Rejected"
          ? "Request rejected by Coordinator (Final)"
          : "Request approved and forwarded to HOD"
    });
  } catch (error) {
    console.error(error); // 🔍 helpful for debugging
    res.status(500).json({ message: "Failed to update request" });
  }
};

/* ================= COORDINATOR HISTORY ================= */
exports.getCoordinatorHistory = async (req, res) => {
  try {
    const history = await GatePassRequest.find({
      "coordinator.decision": { $ne: "Pending" }
    }).sort({ updatedAt: -1 });

    const updatedHistory = await Promise.all(
      history.map(async (reqItem) => {
        const student = await Student.findOne(
          { rollNo: reqItem.student.rollNo },
          "photo"
        );

        return {
          ...reqItem.toObject(),
          student: {
            ...reqItem.student,
            photo: student?.photo || ""
          }
        };
      })
    );

    res.json(updatedHistory);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch coordinator history" });
  }
};
