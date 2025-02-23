const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config(); // Load environment variables

// ✅ Register User
exports.register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save new user
    const newUser = new User({ fullName, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Login User
exports.login = async (req, res) => {
  try {
      const { email, password } = req.body;

      // Validate input fields
      if (!email?.trim() || !password?.trim()) {
          return res.status(400).json({ message: "Email and password are required" });
      }

      const normalizedEmail = email.toLowerCase().trim();

      // Check if user exists
      const user = await User.findOne({ email: normalizedEmail });
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(403).json({ message: "Invalid credentials" });
      }

      // Generate JWT token with userId
      const token = jwt.sign(
          { 
              userId: user._id,  // Make sure this matches what submitCode expects
              email: user.email 
          },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
      );

      res.status(200).json({
          token,
          user: {
              id: user._id,
              email: user.email,
              fullName: user.fullName,
          },
      });
      
  } catch (error) {
      console.error("Login Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
  }
};