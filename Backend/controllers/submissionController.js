const Submission = require("../models/Submission");
const mongoose = require("mongoose");
const crypto = require("crypto");

const generateHash = (code) => crypto.createHash("sha256").update(code).digest("hex");

exports.submitCode = async (req, res) => {
  try {
      const { language, code } = req.body;
      const userId = req.user.userId;  // Extract user ID from JWT token

      if (!userId || !language || !code) {
          return res.status(400).json({ message: "Missing required fields" });
      }

      if (!mongoose.Types.ObjectId.isValid(userId)) {
          return res.status(400).json({ message: "Invalid userId format" });
      }

      const codeHash = generateHash(code);

      // Check for duplicate submissions
      const isDuplicate = await Submission.exists({ userId, hash: codeHash });
      if (isDuplicate) {
          return res.status(400).json({ message: "Potential plagiarism detected!" });
      }

      // Save the new submission
      const newSubmission = new Submission({
          userId,
          language,
          code,
          hash: codeHash,
          status: "Pending",
          createdAt: new Date(),
      });

      console.log("Saving new submission:", newSubmission);
      await newSubmission.save();
      console.log("Submission saved successfully!");


      res.status(201).json({ message: "Submission received", submissionId: newSubmission._id });

  } catch (error) {
      console.error("Code submission error:", error);
      res.status(500).json({ message: "Internal Server Error" });
  }
};
