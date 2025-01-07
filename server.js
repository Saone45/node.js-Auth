require("dotenv").config();
const express = require("express");
const connectToDB = require("./dataBase/connectingToDB");
const authRoutes = require("./Routes/authRoute");
const homeRoute = require("./Routes/homeRoute");
const adminRoute = require("./Routes/adminRoutes");
const uploadImageRoutes = require("./Routes/imageRoute");

const app = express();
const port = process.env.PORT;

/// connecting to DataBase -->
connectToDB();

//inbuild Middleware to parse json -->
app.use(express.json());

/// Authentication Routes -->
app.use("/api/auth", authRoutes);

// Home Route -->
app.use("/api/home", homeRoute);

// Admin route -->
app.use("/api/admin", adminRoute);

/// upload Image Route -->
app.use("/api/image", uploadImageRoutes);

// app.get("/", (req, res) => {
//   res.send("Welcome To Home Page");
// });

app.listen(port, () => {
  console.log(`app is listining on port${port}`);
});
