const GatePassRequest = require("../models/GatePassRequest");
const Student = require("../models/Student");
const { sendSMSAfterApproval } = require("./gatepassController"); 

/* ================= PENDING REQUESTS ================= */
exports.getPendingRequests = async (req, res) => {
  try {
    const requests = await GatePassRequest.find({
      "coordinator.decision": "Approved",
      "hod.decision": "Pending",
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
    res.status(500).json({ message: "Failed to fetch HOD requests" });
  }
};

/* ================= TAKE ACTION ================= */
exports.takeAction = async (req, res) => {
  try {
    const { decision, remarks } = req.body;

    const request = await GatePassRequest.findOne({
      requestId: req.params.requestId
    });

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status === "Rejected by Coordinator") {
      return res.status(400).json({
        message: "Request already rejected by Coordinator"
      });
    }

    // ✅ Update HOD decision
    request.hod.decision = decision;
    request.hod.decisionDate = new Date();
    request.hod.remarks = remarks;

    if (decision === "Approved") {
      request.status = "Approved";
    } else {
      request.status = "Rejected by HOD";
    }

    // ✅ SAVE FIRST (VERY IMPORTANT)
    await request.save();

    // 🔔 SEND SMS AFTER FINAL APPROVAL (SAFE WAY)
    if (decision === "Approved") {
      try {
        await sendSMSAfterApproval(request._id);
      } catch (smsErr) {
        console.error("⚠️ SMS failed but approval succeeded:", smsErr.message);
      }
    }

    res.json({
      success: true,
      message: `Request ${decision} by HOD`
    });
  } catch (error) {
    console.error("❌ HOD takeAction error:", error.message);
    res.status(500).json({ message: "Failed to update request" });
  }
};

/* ================= HOD HISTORY ================= */
exports.getHodHistory = async (req, res) => {
  try {
    const history = await GatePassRequest.find({
      "hod.decision": { $ne: "Pending" }
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
    res.status(500).json({ message: "Failed to fetch HOD history" });
  }
};
