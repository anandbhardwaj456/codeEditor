import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Axios from "axios";
import Editor from "@monaco-editor/react";
import Navbar from "../src/components/Navbar";
import LoginPage from "../src/components/LoginPage";
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

    // Fetch authentication status on mount
    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsAuthenticated(!!token);
    }, []);

    const options = { fontSize };

    // Function to compile code
    const compile = async () => {
        if (!userCode) return;
        setLoading(true);

        try {
            const res = await Axios.post("http://localhost:8000/api/compile", {
                code: userCode,
                language: userLang,
                input: userInput,
            });

            setUserOutput(res.data.stdout || res.data.stderr);
        } catch (err) {
            console.error(err);
            setUserOutput("Error: " + (err.response ? err.response.data.error : err.message));
        } finally {
            setLoading(false);
        }
    };

    const clearOutput = () => setUserOutput("");

    return (
        <Router>
            <Routes>
                {/* Redirect authenticated users to the compiler */}
                <Route path="/" element={isAuthenticated ? <Navigate to="/compiler" /> : <LoginPage />} />
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
                                        <button className="run-btn" onClick={compile}>Run</button>
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
