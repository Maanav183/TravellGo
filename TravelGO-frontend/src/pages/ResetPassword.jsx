import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../style/auth.css";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `http://localhost:8888/auth/reset-password/${token}`,
        { password }
      );
      alert("Password reset successful ✅");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Reset failed");
    }
  };

  return (
    <div className="auth-container auth-bg">
      <div className="auth-box">
        <h2 className="travel-title">Create New Password 🔑</h2>
        <p className="travel-subtitle">
          Choose a strong password to secure your account
        </p>

        <form onSubmit={handleReset} className="travel-form">
          <div className="travel-input">
            <i className="bi bi-lock"></i>
            <input
              type="password"
              placeholder="Enter new password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="travel-btn">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}
