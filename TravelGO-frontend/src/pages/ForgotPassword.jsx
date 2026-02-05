import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/Auth.css";
import api from "../services/api";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP + New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await api.auth.forgotPassword(email);
      if (res.data?.message && (res.data.message.includes("sent") || res.data.message.includes("OTP"))) {
        setMessage("OTP sent to " + email);
        setStep(2);
      } else {
        setError(res.data?.message || "User not found");
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      setError("Failed to send OTP. Please check the email.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await api.auth.resetPassword({ email, otp, newPassword });
      if (res.data?.message === "Password reset successful") {
        setMessage("Password reset successful! Redirecting...");
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(res.data?.message || "Invalid OTP");
      }
    } catch (err) {
      console.error("Reset password error:", err);
      setError("Failed to reset password. Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card row g-0">
        <div className="col-md-6 auth-image"></div>

        <div className="col-md-6 auth-form">
          <h2 className="travel-title">🔐 Forgot Password?</h2>
          <p className="travel-subtitle">
            {step === 1 ? "Enter your email to receive an OTP" : "Enter OTP and your new password"}
          </p>

          <form onSubmit={step === 1 ? handleSendOtp : handleResetPassword} className="travel-form">

            {/* Step 1: Email Input */}
            {step === 1 && (
              <div className="travel-input">
                <i className="bi bi-envelope"></i>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>
            )}

            {/* Step 2: OTP & New Password */}
            {step === 2 && (
              <>
                <div className="travel-input">
                  <i className="bi bi-key"></i>
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    maxLength={6}
                  />
                </div>
                <div className="travel-input">
                  <i className="bi bi-lock"></i>
                  <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            {/* Feedback Messages */}
            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            <button className="travel-btn" type="submit" disabled={loading}>
              {loading ? "Processing... ⏳" : (step === 1 ? "Send OTP ✉️" : "Reset Password 🔄")}
            </button>
          </form>

          <div className="auth-link">
            Remember your password? <Link to="/login">Back to Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}