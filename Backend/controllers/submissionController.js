const Submission = require("../models/Submission");
const mongoose = require("mongoose");
const crypto = require("crypto");

const generateHash = (code) => crypto.createHash("sha256").update(code).digest("hex");

exports.submitCode = async (req, res) => {
  try {
    const { userId, language, code } = req.body;

    // Validate input fields
    if (!userId || !language || !code) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate MongoDB ObjectID format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId format" });
    }

    const codeHash = generateHash(code);

    // Check for duplicate submissions using .exists() (More efficient)
    const isDuplicate = await Submission.exists({ userId, hash: codeHash });
    if (isDuplicate) {
      return res.status(400).json({ message: "Potential plagiarism detected!" });
    }

    // Save new submission
    const newSubmission = new Submission({
      userId,
      language,
      code,
      hash: codeHash,
      status: "Pending",
    });

    await newSubmission.save();

    res.status(201).json({ message: "Submission received", submissionId: newSubmission._id });

  } catch (error) {
    console.error("Code submission error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
