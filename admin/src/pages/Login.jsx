import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

import { LockOutlined, ArrowForward, Person } from "@mui/icons-material";

import "./css/Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error("Please enter username and password");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("http://localhost:5000/api/auth/login", {
        username,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Login Successful");

      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="left-side">
        <div className="overlay">
          <span className="brand">STYLEHUB</span>

          <h1>
            Admin <br />
            Dashboard
          </h1>

          <p>
            Manage products, orders, customers and everything from one premium
            dashboard.
          </p>
        </div>
      </div>

      <div className="right-side">
        <div className="login-card">
          <div className="logo">👕</div>

          <h2>Welcome Back</h2>

          <p>Sign in to continue</p>

          <form onSubmit={handleLogin}>
            <div className="input-box">
              <Person />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="input-box">
              <LockOutlined />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button className="login-btn" disabled={loading}>
              {loading ? (
                "Signing In..."
              ) : (
                <>
                  Login
                  <ArrowForward />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
