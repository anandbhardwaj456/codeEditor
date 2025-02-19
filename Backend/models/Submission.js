const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  language: { type: String, required: true }, // e.g., Python, JavaScript, Java
  code: { type: String, required: true },
  hash: { type: String, required: true }, // SHA-256 hash for plagiarism check
  status: { type: String, enum: ["Pending", "Success", "Error"], default: "Pending" },
  output: { type: String, default: "" },
  executionTime: { type: Number, default: 0 }, // In milliseconds
  memoryUsage: { type: Number, default: 0 }, // In MB
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Submission", submissionSchema);
