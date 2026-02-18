const mongoose = require("mongoose");

const pastResponseSchema = new mongoose.Schema(
  {
    requestId: String,
    studentRollNo: String,
    studentName: String,
    decision: String,
    decisionDate: String
  },
  { _id: false }
);

const pendingRequestSchema = new mongoose.Schema(
  {
    requestId: String,
    studentRollNo: String,
    studentName: String,
    section: String,
    reason: String,
    priority: String,
    coordinatorDecision: String,
    appliedDate: String
  },
  { _id: false }
);

const hodSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    role: { type: String, default: "hod" },

    branch: String,
    status: { type: String, default: "active" },

    pendingRequests: [pendingRequestSchema],
    pastResponses: [pastResponseSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hod", hodSchema);
