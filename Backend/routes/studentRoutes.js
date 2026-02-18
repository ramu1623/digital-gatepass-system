const express = require("express");
const router = express.Router();

const {
  getStudentDashboard,
  applyGatePass,
  getStudentGatePasses
} = require("../controllers/studentController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

/* ================= STUDENT DASHBOARD ================= */
router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware("student"),
  getStudentDashboard
);

/* ================= APPLY GATE PASS ================= */
router.post(
  "/apply",
  authMiddleware,
  roleMiddleware("student"),
  applyGatePass   // ✅ NO BLOCKING MIDDLEWARE
);

/* ================= STUDENT GATE PASSES ================= */
router.get(
  "/gatepasses",
  authMiddleware,
  roleMiddleware("student"),
  getStudentGatePasses
);

module.exports = router;
