import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";  // ✅ Import Link
import axios from "axios";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:3000/api/auth/login", { email, password });

      if (res.data.success) {
        localStorage.setItem("token", res.data.token); // ✅ Store JWT Token
        console.log("✅ Login Successful, Token:", res.data.token);
        navigate("/editor"); // ✅ Redirect to editor
      } else {
        alert("❌ Invalid login credentials!");
      }
    } catch (err) {
      console.error("❌ Login Error:", err.response?.data?.msg || err.message);
      alert("❌ Login failed! Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
      </form>
      <p>Don't have an account? <Link to="/register">Register here</Link></p>
    </div>
  );
}

export default Login;
