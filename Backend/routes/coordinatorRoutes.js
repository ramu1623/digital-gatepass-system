const express = require("express");
const router = express.Router();

const {
  getPendingRequests,
  takeAction,
  getCoordinatorHistory
} = require("../controllers/coordinatorController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get(
  "/requests",
  authMiddleware,
  roleMiddleware("coordinator"),
  getPendingRequests
);

// ✅ FIXED: use requestId instead of id
router.post(
  "/action/:requestId",
  authMiddleware,
  roleMiddleware("coordinator"),
  takeAction
);

router.get(
  "/history",
  authMiddleware,
  roleMiddleware("coordinator"),
  getCoordinatorHistory
);

module.exports = router;
