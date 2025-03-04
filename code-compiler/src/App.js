import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";
import Navbar from "./Components/Navbar";
import AuthNavbar from "./Components/authNavbar";
import CodeEditor from "./Components/CodeEditor";
import Login from "./Components/Login";
import Register from "./Components/Register";

function App() {
    // ✅ Define states for language, theme, and font size
    const [userLang, setUserLang] = useState(localStorage.getItem("userLang") || "python");
    const [userTheme, setUserTheme] = useState(localStorage.getItem("userTheme") || "vs-dark");
    const [fontSize, setFontSize] = useState(Number(localStorage.getItem("fontSize")) || 16);
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

    useEffect(() => {
        localStorage.setItem("userLang", userLang);
        localStorage.setItem("userTheme", userTheme);
        localStorage.setItem("fontSize", fontSize);
    }, [userLang, userTheme, fontSize]);

    return (
        <Router>
            <MainContent 
                userLang={userLang} setUserLang={setUserLang}
                userTheme={userTheme} setUserTheme={setUserTheme}
                fontSize={fontSize} setFontSize={setFontSize}
                isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated}
            />
        </Router>
    );
}

function MainContent({ userLang, setUserLang, userTheme, setUserTheme, fontSize, setFontSize, isAuthenticated, setIsAuthenticated }) {
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsAuthenticated(!!token);
    }, [location.pathname]);

    const showAuthNavbar = location.pathname === "/" || location.pathname === "/register";

    return (
        <>
            {showAuthNavbar ? (
                <AuthNavbar />
            ) : (
                <Navbar 
                    isAuthenticated={isAuthenticated} 
                    setIsAuthenticated={setIsAuthenticated}
                    userLang={userLang} setUserLang={setUserLang}
                    userTheme={userTheme} setUserTheme={setUserTheme}
                    fontSize={fontSize} setFontSize={setFontSize}
                />
            )}

            <Routes>
                <Route path="/" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="/register" element={<Register />} />
                <Route 
                    path="/editor" 
                    element={isAuthenticated ? 
                        <CodeEditor userLang={userLang} userTheme={userTheme} fontSize={fontSize} /> 
                        : <Navigate to="/" />
                    } 
                />
            </Routes>
        </>
    );
}

export default App;
