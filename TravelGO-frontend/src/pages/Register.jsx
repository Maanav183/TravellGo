import { useState } from "react";
//import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/Auth.css";
import api from "../services/api";


export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNo: "",
    address: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setError("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const navigate = useNavigate();



  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validatePassword(form.password)) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await api.auth.signup(form);
      console.log("Registration Success:", response.data);
      alert("Registration Successful! Welcome to TravelGO 🌍");
      navigate("/login");
    } catch (error) {
      console.error("Registration Error:", error);
      setError("Registration Failed: " + (error.response?.data?.message || "Unknown error"));
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card row g-0">
        {/* LEFT IMAGE */}
        <div className="col-md-6 auth-image"></div>

        {/* RIGHT FORM */}
        <div className="col-md-6 auth-form">
          <h2 className="travel-title">🌍 TravelGO</h2>
          <p className="travel-subtitle">
            Create your account & start exploring
          </p>

          <form onSubmit={handleRegister} className="travel-form">
            {[
              { name: "name", icon: "person", placeholder: "Full Name" },
              { name: "email", icon: "envelope", placeholder: "Email", type: "email" },
              { name: "password", icon: "lock", placeholder: "Password", type: "password" },
              {
                name: "confirmPassword",
                icon: "lock-fill",
                placeholder: "Confirm Password",
                type: "password",
              },
              { name: "phoneNo", icon: "phone", placeholder: "Phone Number" },
              { name: "address", icon: "geo-alt", placeholder: "Address" },
            ].map((field, i) => (
              <div className="travel-input" key={i}>
                <i className={`bi bi-${field.icon}`}></i>
                <input
                  name={field.name}
                  type={field.type || "text"}
                  placeholder={field.placeholder}
                  value={form[field.name]}
                  onChange={handleChange}
                  required={
                    field.name !== "phoneNo" && field.name !== "address"
                  }
                />
              </div>
            ))}

            {/* ERROR MESSAGE */}
            {error && <p className="form-error">{error}</p>}

            <button className="travel-btn" type="submit">
              Start Your Journey ✈️
            </button>
          </form>

          <div className="auth-link">
            Already travelling with us? <Link to="/login">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}