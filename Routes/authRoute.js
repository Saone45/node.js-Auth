const express = require("express");
const {
  register,
  login,
  changePassword,
} = require("../controllers/authController");
const authMiddleware = require("../Middleware/authMiddleware");
const router = express.Router();

/// all Router are releated to authentication and authorization
router.post("/register", register);
router.post("/login", login);
// router for changing password -->
router.post("/change-password", authMiddleware, changePassword);

module.exports = router;
