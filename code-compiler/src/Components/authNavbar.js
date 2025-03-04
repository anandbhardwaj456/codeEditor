import { Link } from "react-router-dom";
import "./AuthNavbar.css"; 

function AuthNavbar() {
  return (
    <nav className="auth-navbar">
      <h1>Code Compiler</h1>
      <div className="nav-links">
        <Link to="/">Login</Link>
        <Link to="/register">Register</Link>
      </div>
    </nav>
  );
}

export default AuthNavbar;
