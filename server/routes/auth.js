const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User"); 
require("dotenv").config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// ✅ Register Route
router.post(
    "/register",
    [
        body("email").isEmail().withMessage("Invalid email format"),
        body("password")
            .isLength({ min: 6 })
            .withMessage("Password must be at least 6 characters long"),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { email, password } = req.body;
        try {
            let user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({ success: false, msg: "User already exists" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            user = new User({ email, password: hashedPassword });

            await user.save();
            res.status(201).json({ success: true, msg: "User registered successfully" });
        } catch (err) {
            console.error("❌ Registration Error:", err);
            res.status(500).json({ success: false, error: "Internal Server Error" });
        }
    }
);

// ✅ Login Route
router.post(
    "/login",
    [
        body("email").isEmail().withMessage("Invalid email format"),
        body("password").exists().withMessage("Password is required"),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { email, password } = req.body;
        try {
            let user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ success: false, msg: "Invalid email or password" });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ success: false, msg: "Invalid email or password" });
            }

            // ✅ Generate JWT Token
            const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });

            res.status(200).json({ 
                success: true, 
                token 
            });

        } catch (err) {
            console.error("❌ Login Error:", err);
            res.status(500).json({ success: false, error: "Internal Server Error" });
        }
    }
);


module.exports = router;
