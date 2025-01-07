const express = require("express");
const authMiddleware = require("../Middleware/authMiddleware");
const router = express.Router();

router.get("/Welcome", authMiddleware, (req, res) => {
  // userInfo from auth middleware-->
  const { username, userId, role } = req.userInfo;

  res.json({
    message: "Welcome to the Home Page",
    user: {
      _id: userId,
      username,
      role,
    },
  });
});

module.exports = router;
