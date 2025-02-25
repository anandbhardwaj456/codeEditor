import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Axios from "axios";
import Editor from "@monaco-editor/react";
import Navbar from "../src/components/Navbar";
import LoginPage from "../src/components/LoginPage";
import RegisterPage from "../src/components/RegisterPage";
import spinner from "./spinner.svg";
import "./App.css";

function App() {
    const [userCode, setUserCode] = useState("");
    const [userLang, setUserLang] = useState("python");
    const [userTheme, setUserTheme] = useState("vs-dark");
    const [fontSize, setFontSize] = useState(20);
    const [userInput, setUserInput] = useState("");
    const [userOutput, setUserOutput] = useState("");
    const [loading, setLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsAuthenticated(!!token);
    }, []);

    const options = { fontSize };

    // Function to compile and execute code
    const compile = async () => {
        if (!userCode) return;
        setLoading(true);
        
        const token = localStorage.getItem("token");
        const startTime = performance.now();
        
        try {
            const res = await Axios.post("https://codeeditor-1-ocln.onrender.com/compile", {
                code: userCode,
                language: userLang,
                input: userInput,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const executionTime = performance.now() - startTime;
            const output = res.data.stdout || res.data.stderr;
            setUserOutput(output);

            // Save execution log
            await saveExecutionLog({
                language: userLang,
                executionTime,
                memoryUsage: res.data.memoryUsage || 0,
                output,
                error: res.data.stderr || ""
            });

        } catch (err) {
            console.error("Compile Error:", err);
            setUserOutput("Error: " + (err.response?.data?.error || err.message));
        } finally {
            setLoading(false);
        }
    };

    // Function to save execution log
    const saveExecutionLog = async (logData) => {
        const token = localStorage.getItem("token");
        try {
            await Axios.post("https://codeeditor-1-ocln.onrender.com/api/execution/logs", logData, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (err) {
            console.error("Failed to save execution log:", err);
        }
    };

    // Function to handle code submission
    const handleSubmit = async () => {
        if (!userCode) {
            alert("Code cannot be empty!");
            return;
        }
    
        const token = localStorage.getItem("token");
        if (!token) {
            alert("You need to log in first!");
            return;
        }
    
        try {
            console.log("Attempting to submit code...");
            const response = await Axios.post(
                "https://codeeditor-1-edjf.onrender.com/api/submissions",  // This matches our backend route
                {
                    code: userCode,
                    language: userLang,
                },
                {
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
    
            console.log("Submission Response:", response.data);
            alert("Code submitted successfully!");
    
        } catch (error) {
            console.error("Submission Error:", {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
            alert(`Failed to submit code: ${error.response?.data?.message || error.message}`);
        }
    };

    const clearOutput = () => {
        setUserOutput("");
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={isAuthenticated ? <Navigate to="/compiler" /> : <LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                    path="/compiler"
                    element={
                        isAuthenticated ? (
                            <div className="App">
                                <Navbar
                                    userLang={userLang} setUserLang={setUserLang}
                                    userTheme={userTheme} setUserTheme={setUserTheme}
                                    fontSize={fontSize} setFontSize={setFontSize}
                                />
                                <div className="main">
                                    <div className="left-container">
                                        <Editor
                                            options={options}
                                            height="calc(100vh - 50px)"
                                            width="100%"
                                            theme={userTheme}
                                            language={userLang}
                                            defaultLanguage="python"
                                            defaultValue="# Enter your code here"
                                            onChange={(value) => setUserCode(value || "")}
                                        />
                                        <div className="button-container">
                                            <button className="run-btn" onClick={compile}>Run</button>
                                            <button className="submit-btn" onClick={handleSubmit}>Submit</button>
                                        </div>
                                    </div>
                                    <div className="right-container">
                                        <h4>Input:</h4>
                                        <textarea className="input-box" onChange={(e) => setUserInput(e.target.value)} />
                                        
                                        <h4>Output:</h4>
                                        {loading ? (
                                            <div className="spinner-box">
                                                <img src={spinner} alt="Loading..." />
                                            </div>
                                        ) : (
                                            <div className="output-box">
                                                <pre>{userOutput}</pre>
                                                <button onClick={clearOutput} className="clear-btn">Clear</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Navigate to="/" />
                        )
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;