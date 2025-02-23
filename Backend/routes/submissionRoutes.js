const express = require("express");
const { submitCode } = require("../controllers/submissionController");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

// Change this line
router.post("/", authMiddleware, submitCode);  // Remove "submissions" from here

module.exports = router;