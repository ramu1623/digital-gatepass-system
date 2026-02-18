import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { loginUser } from "../../services/authService";
import loginIllustration from "../../assests/Sign up-rafiki.png";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [role, setRole] = useState("student");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = await loginUser({ identifier, password, role });
    setLoading(false);

    if (!data.success) {
      alert(data.message || "Login failed");
      return;
    }

    login(data.user, data.token);

    if (role === "student") navigate("/student/dashboard");
    if (role === "coordinator") navigate("/coordinator/dashboard");
    if (role === "hod") navigate("/hod/dashboard");
  };

  return (
    <div className="auth-page">
      
      {/* LEFT ILLUSTRATION */}
      <div className="auth-left">
        <img
          src={loginIllustration}
          alt="Login Illustration"
        />
      </div>

      {/* RIGHT FORM */}
      <div className="auth-right">
        <div className="auth-container">
          <h2>Login</h2>

          <form onSubmit={handleSubmit}>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="student">Student</option>
              <option value="coordinator">Coordinator</option>
              <option value="hod">HOD</option>
            </select>

            <input
              placeholder="Roll No / ID"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p>
            New user? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
