const mongoose = require("mongoose");

const executionLogSchema = new mongoose.Schema({
  submissionId: { type: mongoose.Schema.Types.ObjectId, ref: "Submission", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  language: { type: String, required: true },
  executionTime: { type: Number, required: true }, // In milliseconds
  memoryUsage: { type: Number, required: true }, // In MB
  output: { type: String, default: "" },
  error: { type: String, default: "" },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ExecutionLog", executionLogSchema);
