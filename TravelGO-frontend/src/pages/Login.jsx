import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/Auth.css"; // Ensure this CSS file exists
import api from "../services/api"; // Import the API service

import { useAuth } from "../hooks/useAuth"; // 🟢 Import Hook

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth(); // 🟢 Destructure login

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.auth.login(form);
      console.log("Login Success (Raw):", response.data);

      if (response.data.token && response.data.user) {
        // 🟢 Use hook to login
        login(response.data.token, response.data.user);

        if (response.data.user.role === 'ROLE_ADMIN') {
          localStorage.setItem("isAdmin", "true"); // 🟢 Set Admin Flag
          navigate("/admin/dashboard");
        } else {
          // alert("Welcome back ✈️");
          navigate("/home");
        }
      } else {
        // Fallback if backend reverts or structure is different
        console.warn("Unexpected login response structure", response.data);
        // Try to handle legacy case if needed, or just throw
        throw new Error("Invalid response from server: Missing token/user");
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Login Failed: " + (error.response?.data?.message || error.message || "Unknown error"));
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card row g-0">
        <div className="col-md-6 auth-image"></div>

        <div className="col-md-6 auth-form">
          <h2 className="travel-title">✈️ TravelGO</h2>
          <p className="travel-subtitle">
            Login & continue your adventure
          </p>

          <form onSubmit={handleLogin} className="travel-form">
            <div className="travel-input">
              <i className="bi bi-envelope"></i>
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>

            <div className="travel-input">
              <i className="bi bi-lock"></i>
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />
            </div>

            <button className="travel-btn" type="submit">
              Explore Dashboard 🌍
            </button>
          </form>

          <div className="forgot-password">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          <div className="auth-link">
            New traveller? <Link to="/register">Create Account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
