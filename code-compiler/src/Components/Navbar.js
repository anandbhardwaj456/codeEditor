import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css"
function Navbar({ userLang, setUserLang, userTheme, setUserTheme, fontSize, setFontSize }) {
    const navigate = useNavigate();

    // ✅ Logout Function
    const handleLogout = () => {
        localStorage.removeItem("token"); // Remove JWT Token
        navigate("/"); // Redirect to Login Page
    };

    return (
        <nav className="navbar">
            <h1>Code Editor</h1>

            {/* Language Selection */}
            <select value={userLang} onChange={(e) => setUserLang(e.target.value)}>
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="java">Java</option>
                <option value="c">C</option>
                <option value="cpp">C++</option>
            </select>

            {/* Theme Selection */}
            <select value={userTheme} onChange={(e) => setUserTheme(e.target.value)}>
                <option value="vs-dark">Dark Theme</option>
                <option value="light">Light Theme</option>
            </select>

            {/* Font Size Selection */}
            <label>Font Size: 
            <input 
                type="number" 
                value={fontSize} 
                min="10" 
                max="30" 
                onChange={(e) => setFontSize(Number(e.target.value))}
            />
            </label>

            {/* ✅ Logout Button */}
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </nav>
    );
}

export default Navbar;
