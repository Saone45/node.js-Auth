const express = require("express");
const authMiddleware = require("../Middleware/authMiddleware");
const adminMiddleware = require("../Middleware/adminMiddleware");
const uploadMiddleware = require("../Middleware/uploadMiddleware");
const {
  uploadImageController,
  fetchImageController,
  deleteImageController,
} = require("../controllers/imageController");

const router = express.Router();

// Upload the Image -->
router.post(
  "/upload",
  authMiddleware,
  adminMiddleware,
  uploadMiddleware.single("image"),
  uploadImageController
);

// Image Route -->
router.get("/get", authMiddleware, fetchImageController);

// Delete Image Route -->
router.delete("/:id", authMiddleware, adminMiddleware, deleteImageController);

module.exports = router;