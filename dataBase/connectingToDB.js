require("dotenv").config();

const mongoose = require("mongoose");

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDb connected Successfully");
  } catch (error) {
    console.error("MongoDB connection faild");
    process.exit(1);
  }
};

module.exports = connectToDB;
