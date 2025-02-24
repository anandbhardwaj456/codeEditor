const express = require("express");
const axios = require("axios");
const ExecutionLog = require("../models/Executionlog");
const router = express.Router();

router.post("/compile", async (req, res) => {
    try {
        const { code, language, input } = req.body;
        const userId = req.user ? req.user.userId : null; // Ensure userId is available

        // Send code to backend executor
        const executionResponse = await axios.post("https://codeeditor-1-ocln.onrender.com/api/execute", {
            code,
            language,
            input
        });

        if (!executionResponse.data) {
            return res.status(500).json({ error: "Execution service unavailable" });
        }

        // Save execution log if user is authenticated
        if (userId) {
            const executionLog = new ExecutionLog({
                userId,
                language,
                code,
                output: executionResponse.data.output,
                executionTime: executionResponse.data.executionTime,
                status: 'completed'
            });
            await executionLog.save();
        }

        res.json(executionResponse.data);
    } catch (error) {
        console.error("Code execution error:", error);
        res.status(500).json({ error: "Code execution failed" });
    }
});

module.exports = router;
