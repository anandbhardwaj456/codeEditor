import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import "./codeEditor.css";

function CodeEditor({ userLang, setUserLang, userTheme, fontSize }) {
    const [userCode, setUserCode] = useState("");
    const [userInput, setUserInput] = useState("");
    const [output, setOutput] = useState("");
    const [loading, setLoading] = useState(false);
    const [execLogs, setExecLogs] = useState([]); // ✅ Store Execution Logs
    const [submissionLogs, setSubmissionLogs] = useState([]); // ✅ Store Submission Logs

    const token = localStorage.getItem("token");

    // ✅ Fetch Execution & Submission Logs on Component Mount
    useEffect(() => {
        if (!token) return;

        // Fetch Execution Logs
        axios.get("http://localhost:3000/api/executions", {
            headers: { "x-auth-token": token }
        })
        .then(res => setExecLogs(res.data.logs))
        .catch(err => console.error("❌ Fetch Execution Logs Error:", err));

        // Fetch Submission Logs
        axios.get("http://localhost:3000/api/submissions", {
            headers: { "x-auth-token": token }
        })
        .then(res => setSubmissionLogs(res.data.logs))
        .catch(err => console.error("❌ Fetch Submission Logs Error:", err));
    }, [token]);

    // ✅ Handle Code Execution
    const handleRun = async () => {
        setLoading(true);
        setOutput("Running...");

        if (!token) {
            setOutput("❌ Authentication required. Please log in.");
            setLoading(false);
            return;
        }

        try {
            const res = await axios.post("http://localhost:3000/api/execute", {
                code: userCode,
                language: userLang,
                input: userInput
            }, {
                headers: { "x-auth-token": token }
            });

            console.log("✅ Execution API Response:", res.data);

            if (res.data.success) {
                setOutput(`Output:\n${res.data.output}\n\nTime: ${res.data.time}s\nMemory: ${res.data.memory}KB`);

                // ✅ Update Execution Logs
                setExecLogs(prevLogs => [{ 
                    language: userLang, 
                    output: res.data.output, 
                    time: res.data.time, 
                    memory: res.data.memory 
                }, ...prevLogs]);

                // ✅ Update Submission Logs
                setSubmissionLogs(prevLogs => [{
                    language: userLang,
                    code: userCode,
                    input: userInput,
                    output: res.data.output,
                    status: res.data.status
                }, ...prevLogs]);

            } else {
                setOutput(res.data.error || "❌ Execution failed.");
            }
        } catch (err) {
            console.error("❌ Execution Error:", err);
            setOutput(err.response?.data?.error || "Execution failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="editor-container">
            <h2>Online Code Editor</h2>

            {/* Code Editor */}
            <Editor
                height="400px"
                language={userLang}
                theme={userTheme}
                value={userCode}
                options={{ fontSize: fontSize }}
                onChange={(value) => setUserCode(value)}
            />

            {/* Input Box */}
            <div className="input-container">
                <h4>Input:</h4>
                <textarea 
                    value={userInput} 
                    onChange={(e) => setUserInput(e.target.value)} 
                    placeholder="Enter input here..."
                />
            </div>

            {/* Run Button */}
            <button className="run-btn" onClick={handleRun} disabled={loading}>
                {loading ? "Running..." : "Run Code"}
            </button>

            {/* Output Box */}
            <div className="output-container">
                <h4>Output:</h4>
                <pre>{output}</pre>
            </div>

            {/* Execution Logs Section */}
            <div className="logs-container">
                <h4>Execution Logs:</h4>
                <ul>
                    {execLogs.map((log, index) => (
                        <li key={index}>
                            <strong>{log.language}</strong> - {log.output} 
                            <br />⏱ {log.time}s | 🖥 {log.memory}KB
                        </li>
                    ))}
                </ul>
            </div>

            {/* Submission Logs Section */}
            <div className="logs-container">
                <h4>Submission Logs:</h4>
                <ul>
                    {submissionLogs.map((log, index) => (
                        <li key={index}>
                            <strong>{log.language}</strong> - {log.output} 
                            <br />📝 Code: {log.code} 
                            <br />🎯 Status: {log.status}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default CodeEditor;
