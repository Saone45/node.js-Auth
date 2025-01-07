const multer = require("multer");
const path = require("path");

// set our multer storage

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,

      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

/// check some file filter function -->
const checkFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Not an Image ! Please upload only Image"));
  }
};

/// multer middleware

 module.exports = multer({
    storage:storage,
    fileFilter: checkFileFilter,
    limits : {
        fieldSize: 5 * 1024 * 1024 // 5MB file size limit
    }
 })
