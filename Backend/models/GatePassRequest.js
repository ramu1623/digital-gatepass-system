const mongoose = require("mongoose");

const gatePassRequestSchema = new mongoose.Schema(
  {
    // ✅ UNIQUE GATE PASS ID
    requestId: {
      type: String,
      unique: true,
      required: true,
      index: true
    },

    student: {
      rollNo: String,
      name: String,
      branch: String,
      section: String,
      year: String
    },

    reason: {
      type: String,
      required: true
    },

    fromDate: String,
    toDate: String,

    // ⏰ OUT TIME (24-hour format from student)
    outTime: {
      type: String,
      required: true
    },

    // ⏳ DURATION IN HOURS (e.g. 2, 3, 4)
    durationHours: {
      type: Number,
      required: true,
      min: 1
    },

    // 🏷️ DURATION LABEL FOR UI
    durationLabel: {
      type: String,
      required: true
    },

    // ⏱️ EXPECTED RETURN TIME (24-hour format)
    expectedReturnTime: {
      type: String,
      default: null
    },

    // 📅 WHOLE DAY FLAG
    isWholeDay: {
      type: Boolean,
      default: false
    },

    // 🤖 ML PREDICTED PRIORITY
    priority: {
      type: String,
      enum: ["High", "Normal", "Low"],
      default: "Normal"
    },

    // 🔴 FINAL STATUS (single source of truth)
    status: {
      type: String,
      enum: [
        "Pending",
        "Approved",
        "Rejected by Coordinator",
        "Rejected by HOD"
      ],
      default: "Pending"
    },

    coordinator: {
      id: String,
      decision: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending"
      },
      decisionDate: { type: String, default: null },
      remarks: { type: String, default: null }
    },

    hod: {
      id: String,
      decision: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending"
      },
      decisionDate: { type: String, default: null },
      remarks: { type: String, default: null }
    },

    appliedDate: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("GatePassRequest", gatePassRequestSchema);
