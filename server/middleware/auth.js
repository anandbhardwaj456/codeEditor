const jwt = require("jsonwebtoken");
require("dotenv").config(); // Load environment variables

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
};