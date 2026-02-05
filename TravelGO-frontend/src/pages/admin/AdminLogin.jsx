import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, User, Lock } from 'lucide-react';
import api from "../../services/api"; // 🟢 Import API

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    // Clear previous session to avoid conflicts
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");

    try {
      // 🟢 Real Backend Authentication
      const response = await api.auth.login(credentials);
      const { token, user } = response.data;

      // 🟢 Verify Role
      if (user.role === "ROLE_ADMIN") {
        localStorage.setItem("authToken", token); // Store Token
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("isAdmin", "true");
        navigate("/admin/dashboard");
      } else {
        alert("Access Denied: You do not have Admin privileges.");
      }
    } catch (error) {
      console.error("Login Failed", error);
      alert("Invalid Credentials or Server Error");
    }
  };

  return (
    <div className="admin-login-root">
      <div className="login-card">
        <div className="login-header">
          <ShieldCheck size={40} color="#facc15" />
          <h2>Admin Portal</h2>
          <p>TravelGO Management System</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-field">
            <User size={18} />
            <input
              type="email"
              placeholder="admin@travelgo.com"
              required
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
            />
          </div>

          <div className="input-field">
            <Lock size={18} />
            <input
              type="password"
              placeholder="Password"
              required
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            />
          </div>

          <button type="submit" className="login-btn">
            Authenticate & Enter
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <a href="/forgot-password" style={{ color: "black", textDecoration: "none", fontSize: "0.9rem" }}>
            Forgot Password?
          </a>
        </div>

        <p className="login-footer">Protected by TravelGO Security</p>
      </div>
    </div>
  );
};

export default AdminLogin;