const Submission = require("../models/Submission");
const ExecutionLog = require("../models/Executionlog");
const crypto = require("crypto");

const generateHash = (code) => crypto.createHash("sha256").update(code).digest("hex");

exports.submitCode = async (req, res) => {
  try {
    const { userId, language, code } = req.body;
    const codeHash = generateHash(code);

    const pastSubmissions = await Submission.find({ userId }, "hash");
    if (pastSubmissions.some(sub => sub.hash === codeHash)) {
      return res.status(400).json({ message: "Potential plagiarism detected!" });
    }

    const newSubmission = new Submission({
      userId,
      language,
      code,
      hash: codeHash,
      status: "Pending"
    });

    await newSubmission.save();
    res.status(201).json({ message: "Submission received", submissionId: newSubmission._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
