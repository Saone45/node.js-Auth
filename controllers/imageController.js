const Image = require("../models/imageModel");
const { uploadToCloudinary } = require("../helpers/cloudinaryHelper");
const fs = require("fs");
const cloudinary = require("../config/cloudinary");

const uploadImageController = async (req, res) => {
  try {
    /// check if file is missing in req object
    if (!req.file) {
      return res.status(400).json({
        success: true,
        message: "File is required! Please upload an Image",
      });
    }

    // Upload To Cloudinary -->
    const { url, publicId } = await uploadToCloudinary(req.file.path);

    // Storing Image url and piblicId along with user id in DataBase
    const newlyUploadedImage = new Image({
      url,
      publicId,
      uploadedBy: req.userInfo.userId,
    });

    // Saving to DataBase ==>
    await newlyUploadedImage.save();

    // Deleting file from Local Storage after uploading the file -->
    fs.unlinkSync(req.file.path);

    res.status(201).json({
      success: true,
      message: "Image Uploaded Successfuly",
      image: newlyUploadedImage,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: true,
      Message: "something went Wrong",
    });
  }
};

// Fetching all image -->

const fetchImageController = async (req, res) => {
  try {
    /// Pagination -->
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;
    const skip = (page - 1) * limit;

    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    const totalImages = await Image.countDocuments();
    const totalPages = Math.ceil(totalImages / limit);

    const sortObj = {};
    sortObj[sortBy] = sortOrder;

    // find all image -->
    const image = await Image.find().sort(sortBy).skip(skip).limit(limit);

    // check if Image is present or not -->
    if (image) {
      res.status(200).json({
        success: true,
        currentPage :page,
        totalPages:totalPages,
        totalImages:totalImages,
        data: image,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something Went Wrong",
    });
  }
};

// Deleting image -->

const deleteImageController = async (req, res) => {
  try {
    // getting image id
    const getCurrentIdOfImageToDelete = req.params.id;
    // get user id
    const userId = req.userInfo.userId;

    // find Current Image-->
    const image = await Image.findById(getCurrentIdOfImageToDelete);

    // chek image present or not -->
    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    /// check if this image is uploaded by the current user who is trying to delete this image -->

    if (image.uploadedBy.toString() !== userId) {
      returnres.status(403).json({
        success: true,
        message: "you cant delete authorized to delete this image",
      });
    }

    /// delete this image first from your cloudinary storage
    await cloudinary.uploader.destroy(image.publicId);

    // delete this image from mongoDB dataBase -->
    await Image.findByIdAndDelete(getCurrentIdOfImageToDelete);

    res.status(200).json({
      success: true,
      message: "ImageDeleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Somethin Went Wrong! Please try again",
    });
  }
};

module.exports = {
  uploadImageController,
  fetchImageController,
  deleteImageController,
};
