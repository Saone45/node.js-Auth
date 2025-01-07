const jwt = require("jsonwebtoken");

/// authentication middleware -->
const authMiddleware = (req, res, next) => {
  // getting our oth header -->
  const authHeader = req.headers["authorization"];

  console.log(authHeader);

  // getting token and spliting that we only want brarar token not a bearar name->
  const token = authHeader && authHeader.split(" ")[1];

  // Ckecking the the token -->
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access Denied. No token Provided. Please Login to Continue",
    });
  }

  // Decoding Token -->
  try {
    const decodedTokenInfo = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log(decodedTokenInfo);

    // passing userInfo to req -->
    req.userInfo = decodedTokenInfo;

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Access Denied. No token Provided. Please Login to Continue",
    });
  }
};

module.exports = authMiddleware;
