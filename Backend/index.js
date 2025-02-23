const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const Axios = require("axios");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Importing Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/submissions", require("./routes/submissionRoutes")); 
app.use("/api/execution", require("./routes/executionLogRoutes"));
app.use("/api/compile", require("./routes/compile"));

// Code Compilation API Route
app.post("/compile", async (req, res) => {
    try {
        let { code, language, input } = req.body;

        let languageMap = {
            "c": { language: "c", version: "10.2.0" },
            "cpp": { language: "c++", version: "10.2.0" },
            "python": { language: "python", version: "3.10.0" },
            "java": { language: "java", version: "15.0.2" }
        };

        if (!languageMap[language]) {
            return res.status(400).json({ error: "Unsupported language" });
        }

        let data = {
            "language": languageMap[language].language,
            "version": languageMap[language].version,
            "files": [{ "name": "main", "content": code }],
            "stdin": input
        };

        let config = {
            method: 'post',
            url: 'https://emkc.org/api/v2/piston/execute',
            headers: { 'Content-Type': 'application/json' },
            data
        };

        let response = await Axios(config);
        res.json(response.data.run);
    } catch (error) {
        console.error("Error in code execution:", error);
        res.status(500).json({ error: "Code execution failed" });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
