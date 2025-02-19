const express = require("express");
const router = express.Router();
const { getExecutionLogs, saveExecutionLog } = require("../controllers/executionLogController");
router.get("/logs", getExecutionLogs);  // Fetch execution logs
router.post("/logs", saveExecutionLog); // Save execution logs

module.exports = router;
