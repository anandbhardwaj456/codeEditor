require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const authMiddleware = require("./middleware/auth");
const ExecutionLog = require("./models/ExecutionLogs"); 
const SubmissionLog = require("./models/SubmissionLog"); 
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// ✅ Validate MongoDB URI
if (!MONGO_URI) {
    console.error("❌ MongoDB URI is missing. Check your .env file.");
    process.exit(1);
}

// ✅ Connect to MongoDB with Proper Error Handling
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => {
        console.error("❌ MongoDB connection error:", err.message);
        process.exit(1);
    });

app.use(cors());
app.use(express.json());

// ✅ Authentication Routes
app.use("/api/auth", authRoutes);

// ✅ Code Execution API (Stores Logs in MongoDB)
app.post("/api/execute", authMiddleware, async (req, res) => {
    const { code, language, input } = req.body;

    if (!code || !language) {
        return res.status(400).json({ success: false, error: "Missing code or language" });
    }

    const languageMap = {
        "c": { language: "c", version: "10.2.0" },
        "cpp": { language: "c++", version: "10.2.0" },
        "python": { language: "python", version: "3.10.0" },
        "java": { language: "java", version: "15.0.2" }
    };

    if (!languageMap[language]) {
        return res.status(400).json({ success: false, error: "Unsupported language" });
    }

    try {
        console.log("🔍 Sending request to Piston API...");

        const response = await axios.post("https://emkc.org/api/v2/piston/execute", {
            language: languageMap[language].language,
            version: languageMap[language].version,
            files: [{ name: "main", content: code }],
            stdin: input || ""
        });

        console.log("✅ Piston API Response:", response.data);

        if (!response.data || !response.data.run) {
            throw new Error("Invalid response from execution API");
        }

        const executionOutput = response.data.run.stdout || response.data.run.stderr || "No output";
        const executionTime = response.data.run.time ?? 0;
        const memoryUsage = response.data.run.memory ?? 0;
        const status = response.data.run.stderr ? "Error" : "Success";

        // ✅ Store Execution Log in MongoDB
        const execLog = new ExecutionLog({
            userId: req.user,
            code,
            language,
            input,
            output: executionOutput,
            executionTime,
            memoryUsage
        });

        await execLog.save();

        // ✅ Store Submission Log in MongoDB
        const submissionLog = new SubmissionLog({
            userId: req.user,
            code,
            language,
            input,
            output: executionOutput,
            status
        });

        await submissionLog.save();

        res.json({ 
            success: true, 
            output: executionOutput, 
            time: executionTime, 
            memory: memoryUsage, 
            status 
        });
    } catch (error) {
        console.error("❌ Execution Error:", error.message);
        res.status(500).json({ success: false, error: "Execution failed" });
    }
});

// ✅ Fetch Execution Logs for Logged-in User
app.get("/api/executions", authMiddleware, async (req, res) => {
    try {
        const logs = await ExecutionLog.find({ userId: req.user }).sort({ createdAt: -1 });

        res.json({ success: true, logs });
    } catch (err) {
        console.error("❌ Fetch Logs Error:", err.message);
        res.status(500).json({ success: false, error: "Could not fetch logs" });
    }
});

// ✅ Fetch Submission Logs for Logged-in User
app.get("/api/submissions", authMiddleware, async (req, res) => {
    try {
        const logs = await SubmissionLog.find({ userId: req.user }).sort({ createdAt: -1 });

        res.json({ success: true, logs });
    } catch (err) {
        console.error("❌ Fetch Submission Logs Error:", err.message);
        res.status(500).json({ success: false, error: "Could not fetch submissions" });
    }
});

// ✅ Health Check Route
app.get("/", (req, res) => {
    res.send("✅ Code Execution API is running.");
});

// ✅ 404 Handler
app.use((req, res) => {
    res.status(404).json({ success: false, error: "Route not found" });
});

// ✅ Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
