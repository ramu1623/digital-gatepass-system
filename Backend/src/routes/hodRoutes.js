const express = require("express");
const router = express.Router();

const {
    getPendingRequests,
    takeAction,
    getHodHistory,
} = require("../src/controllers/hodController");

const authMiddleware = require("../src/middleware/authMiddleware");
const roleMiddleware = require("../src/middleware/roleMiddleware");

router.get(
    "/requests",
    authMiddleware,
    roleMiddleware("hod"),
    getPendingRequests
);

// ✅ FIXED: use requestId
router.post(
    "/action/:requestId",
    authMiddleware,
    roleMiddleware("hod"),
    takeAction
);

router.get("/history", authMiddleware, roleMiddleware("hod"), getHodHistory);

module.exports = router;
