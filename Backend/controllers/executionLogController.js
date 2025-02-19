const ExecutionLog = require("../models/Executionlog");

exports.getExecutionLogs = async (req, res) => {
  try {
    const logs = await ExecutionLog.find().populate("userId submissionId");
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.saveExecutionLog = async (req, res) => {
  try {
    const { userId, submissionId, language, executionTime, memoryUsage, output, error } = req.body;

    const newLog = new ExecutionLog({
      userId,
      submissionId,
      language,
      executionTime,
      memoryUsage,
      output,
      error
    });

    await newLog.save();
    res.status(201).json({ message: "Execution log saved successfully", log: newLog });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};