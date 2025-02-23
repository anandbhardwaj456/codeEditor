const express = require("express");
const axios = require("axios");
const ExecutionLog = require("../models/Executionlog");
const router = express.Router();

router.post("/compile", async (req, res) => {
    try {
        const { code, language, input } = req.body;

        // Send code to Docker-based code executor
        const executionResponse = await axios.post("http://code-executor:5000/execute", {
            code,
            language,
            input
        });

        // Save execution log
        const executionLog = new ExecutionLog({
            userId: req.user.userId,
            language,
            code,
            output: executionResponse.data.output,
            executionTime: executionResponse.data.executionTime,
            status: 'completed'
        });
        await executionLog.save();

        res.json(executionResponse.data);
    } catch (error) {
        console.error("Code execution error:", error);
        res.status(500).json({ error: "Code execution failed" });
    }
});

module.exports = router;
