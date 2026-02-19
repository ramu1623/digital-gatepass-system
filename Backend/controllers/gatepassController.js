const GatePassRequest = require("../models/GatePassRequest");
const Student = require("../models/Student");
const Coordinator = require("../models/Coordinator");
const sendSMS = require("../utils/sendSMS");

// ================= GET SINGLE GATE PASS =================
exports.getGatePassById = async (req, res) => {
  try {
    const gatePass = await GatePassRequest.findById(req.params.id);

    if (!gatePass) {
      return res.status(404).json({ message: "Gate pass not found" });
    }

    res.json(gatePass);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch gate pass" });
  }
};

// ================= UPDATE IN-TIME =================
exports.updateInTime = async (req, res) => {
  try {
    const gatePass = await GatePassRequest.findById(req.params.id);

    if (!gatePass) {
      return res.status(404).json({ message: "Gate pass not found" });
    }

    gatePass.inTime = new Date().toLocaleTimeString();
    await gatePass.save();

    res.json({
      success: true,
      message: "In-time updated successfully"
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update in-time" });
  }
};

// ================= CHECK & SEND SMS AFTER FINAL APPROVAL =================
exports.sendSMSAfterApproval = async (gatePassId) => {
  try {
    console.log("🔥 SMS FUNCTION CALLED");

    const gatePass = await GatePassRequest.findById(gatePassId);
    if (!gatePass) {
      console.log("❌ Gate pass not found");
      return;
    }

    console.log("Coordinator decision:", gatePass.coordinator?.decision);
    console.log("HOD decision:", gatePass.hod?.decision);

    if (
      gatePass.coordinator?.decision === "Approved" &&
      gatePass.hod?.decision === "Approved"
    ) {
      console.log("Looking for student rollNo:", gatePass.student?.rollNo);

      const student = await Student.findOne({
        rollNo: gatePass.student.rollNo.trim()
      });

      if (!student || !student.coordinator?.id) {
        console.log("❌ Student or coordinator mapping missing");
        return;
      }

      const coordinator = await Coordinator.findOne({
        id: student.coordinator.id
      });

      if (!coordinator) {
        console.log("❌ Coordinator not found");
        return;
      }

      console.log("Parent Mobile:", student.parentMobile);
      const message = `Dear Parent Getpass approved to your child ${student.name} having Roll No: ${student.rollNo} has taken outing permission due to the Reason: ${gatePass.reason || "N/A"} Out Time: ${gatePass.outTime} Gate Pass ID: ${gatePass.requestId} Expected In Time: ${gatePass.expectedInTime || "N/A"} - From Sri Vasavi Engineering College`;

      await sendSMS(
        "COORDINATOR",          // sender (placeholder)
        student.parentMobile,   // receiver
        message
      );

      console.log("✅ SMS sent to parent successfully");
    }
  } catch (error) {
    console.error("SMS trigger failed:", error.message);
  }
};
