const bcrypt = require("bcryptjs");
const Student = require("../models/Student");
const Coordinator = require("../models/Coordinator");
const Hod = require("../models/Hod");
const generateToken = require("../utils/generateToken");

/* ================= LOGIN ================= */
exports.login = async (req, res) => {
  try {
    const { identifier, password, role } = req.body;

    if (!identifier || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let user;

    if (role === "student") {
      user = await Student.findOne({ rollNo: identifier });
    } else if (role === "coordinator") {
      user = await Coordinator.findOne({ id: identifier });
    } else if (role === "hod") {
      user = await Hod.findOne({ id: identifier });
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id, role);

    let userPayload = {
      id: user._id,
      name: user.name,
      role: user.role,
      photo: user.photo || ""
    };

    if (role === "student") {
      userPayload.branch = user.branch;
      userPayload.section = user.section;
    } else if (role === "coordinator") {
      userPayload.branch = user.branch;
      userPayload.section = user.coordinatingSection; // Map to 'section'
    } else if (role === "hod") {
      userPayload.branch = user.branch;
    }

    res.json({
      success: true,
      token,
      user: userPayload
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
};

/* ================= REGISTER ================= */
exports.register = async (req, res) => {
  try {
    const { role, password } = req.body;

    if (!role || !password) {
      return res.status(400).json({ message: "Role and password are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    /* ================= STUDENT REGISTER ================= */
    if (role === "student") {
      const {
        rollNo,
        name,
        email,
        branch,
        section,
        year,
        semester,
        parentMobile // ✅ NEW
      } = req.body;

      if (!parentMobile) {
        return res
          .status(400)
          .json({ message: "Parent mobile number is required" });
      }

      const exists = await Student.findOne({ rollNo });
      if (exists) {
        return res.status(400).json({ message: "Student already exists" });
      }

      const coordinator = await Coordinator.findOne({
        branch,
        coordinatingSection: section
      });

      const hod = await Hod.findOne({ branch });

      if (!coordinator || !hod) {
        return res.status(400).json({
          message: "Coordinator or HOD not found for this branch/section"
        });
      }

      let photoPath = "";
      if (req.file) {
        photoPath = `/uploads/students/${req.file.filename}`;
      }

      await Student.create({
        rollNo,
        name,
        email,
        password: hashedPassword,
        branch,
        section,
        year,
        semester,
        parentMobile, // ✅ SAVED HERE

        photo: photoPath,

        coordinator: {
          id: coordinator.id,
          name: coordinator.name,
          email: coordinator.email
        },
        hod: {
          id: hod.id,
          name: hod.name,
          email: hod.email
        },

        role: "student",
        status: "active"
      });

      return res.status(201).json({
        success: true,
        message: "Student registered successfully"
      });
    }

    /* ================= COORDINATOR REGISTER ================= */
    if (role === "coordinator") {
      const {
        id,
        name,
        email,
        branch,
        coordinatingSection
      } = req.body;

      const exists = await Coordinator.findOne({ id });
      if (exists) {
        return res.status(400).json({ message: "Coordinator already exists" });
      }

      await Coordinator.create({
        id,
        name,
        email,
        password: hashedPassword,
        branch,
        coordinatingSection,
        role: "coordinator",
        status: "active"
      });

      return res.status(201).json({
        success: true,
        message: "Coordinator registered successfully"
      });
    }

    /* ================= HOD REGISTER ================= */
    if (role === "hod") {
      const { id, name, email, branch } = req.body;

      const exists = await Hod.findOne({ id });
      if (exists) {
        return res.status(400).json({ message: "HOD already exists" });
      }

      await Hod.create({
        id,
        name,
        email,
        password: hashedPassword,
        branch,
        role: "hod",
        status: "active"
      });

      return res.status(201).json({
        success: true,
        message: "HOD registered successfully"
      });
    }

    return res.status(400).json({ message: "Invalid role" });
  } catch (error) {
    res.status(500).json({
      message: "Registration failed",
      error: error.message
    });
  }
};
