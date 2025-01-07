const isAdminUser = (req, res, next) => {
  // checking userInfo role fron authMiddleware that user is admin or not -->
  if (req.userInfo.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied! Admin rights required.",
    });
  }
  next();
};

module.exports = isAdminUser;
