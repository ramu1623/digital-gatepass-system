const express = require("express");
const router = express.Router();

const {
    getGatePassById,
    updateInTime,
} = require("../src/controllers/gatepassController");

const authMiddleware = require("../src/middleware/authMiddleware");

// Get single gate pass details (any logged-in user)
router.get("/:id", authMiddleware, getGatePassById);

// Update in-time when student returns to college
router.put("/in-time/:id", authMiddleware, updateInTime);

module.exports = router;
