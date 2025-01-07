const express = require("express");
const authMiddleware = require("../Middleware/authMiddleware");
const adminMiddleware = require("../Middleware/adminMiddleware");
const router = express.Router();

router.get("/welcome", authMiddleware, adminMiddleware, (req, res) => {
  res.json({
    message: "Welcome to admin page",
  });
});

module.exports = router;
