const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register Controller
const register = async (req, res) => {
  try {
    // Extract user information from request body
    const { username, email, password, role } = req.body;

    // Check if the user already exists in the database
    const checkExistingUser = await User.findOne({
      $or: [{ username }, { email }],
    }); // $or checks if either username or email already exists

    if (checkExistingUser) {
      return res.status(400).json({
        success: false,
        message:
          "User is already taken either with same username or same email",
      });
    }

    // Hash the user password
    const salt = await bcrypt.genSalt(11);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user and save to the database
    const newlyCreatedUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    // Save the newly created user data to the database
    await newlyCreatedUser.save();

    res.status(201).json({
      success: true,
      message: "Registered Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong! Please try again",
    });
  }
};

// Login Controller
const login = async (req, res) => {
  try {
    // Extract User Email And Password from req.body
    const { username, password } = req.body;

    // find if the Current user is exists in data base or not
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid username",
      });
    }

    /// if the password is correct or not-->
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password ! Please Enter correct Password",
      });
    }

    // create user token -->
    const accessToken = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "15m",
      }
    );

    res.status(200).json({
      success: true,
      message: "Logged Successfully",
      accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong! Please try again",
    });
  }
};

/// Change Password -->

const changePassword = async (req, res) => {
  try {
    const userId = req.userInfo.userId;

    // Extract old Password and New Password
    const { oldPassword, newPassword } = req.body;

    // find the current logged in User -->
    const user = await User.findById(userId);

    // Check if user is present or not -->
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not Found",
      });
    }

    // Check if Old password is correct or not -->
    const isPasswordMatch = await bcrypt.compare(oldPassword, user.newPassword);

    //  checking password is Matched or not -->
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message:
          "Old Password is not Correct! please try with Correct Password",
      });
    }

    // if Password Matched then -->

    /// Hash the new password -->
    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(newPassword, salt);

    // Update User Password -->
    user.password = newHashedPassword;

    /// Saving the Password to DataBase -->
    await user.save();

    // After Saving -->
    res.status(200).json({
      success: true,
      message: "Password Updated Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "something Went Wrong",
    });
  }
};

module.exports = { register, login ,changePassword };
