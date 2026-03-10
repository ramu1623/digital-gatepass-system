const mongoose = require("mongoose");

const pastRequestSchema = new mongoose.Schema(
  {
    requestId: String,
    reason: String,
    status: String,
    appliedDate: String
  },
  { _id: false }
);

const studentSchema = new mongoose.Schema(
  {
    rollNo: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    role: { type: String, default: "student" },

    branch: String,
    section: String,
    year: String,
    semester: String,

    // ✅ NEW FIELD (for SMS to parent)
    parentMobile: {
      type: String,
      required: true
    },

    // ✅ Existing photo field
    photo: {
      type: String, // stores image path or URL
      default: ""
    },

    status: { type: String, default: "active" },

    coordinator: {
      id: String,
      name: String,
      email: String
    },

    hod: {
      id: String,
      name: String,
      email: String
    },

    pastRequests: [pastRequestSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
