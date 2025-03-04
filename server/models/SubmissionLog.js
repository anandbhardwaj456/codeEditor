const mongoose = require("mongoose");

const SubmissionLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    code: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    input: {
        type: String,
        default: ""
    },
    output: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Success", "Error"],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("SubmissionLog", SubmissionLogSchema);
