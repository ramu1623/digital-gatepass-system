const express = require("express");
const router = express.Router();

const { login, register } = require("../controllers/authController");

// import multer config
const uploadStudentPhoto = require("../config/multer");

// ✅ Register (student) + photo upload WITH ERROR HANDLING
router.post("/register", (req, res, next) => {
  uploadStudentPhoto.single("photo")(req, res, (err) => {
    if (err) {
      // 🔴 File too large
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message: "Image size must be less than 2MB"
        });
      }

      // 🔴 Invalid file type or other multer error
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }

    next();
  });
}, register);

// Login (student / coordinator / hod)
router.post("/login", login);

module.exports = router;
