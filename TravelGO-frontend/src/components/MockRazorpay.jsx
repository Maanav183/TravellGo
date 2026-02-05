// src/components/MockRazorpay.jsx
import React from "react";
import ReactDOM from "react-dom";
import "../style/MockRazorpay.css";

const MockRazorpay = ({ amount, onSuccess, onClose }) => {
  return ReactDOM.createPortal(
    <div className="mock-razorpay-overlay">
      <div className="mock-razorpay-modal">
        <h2>Payment</h2>
        <p>Total Amount: ₹{amount}</p>
        <button onClick={onSuccess} className="pay-btn">
          Pay Now
        </button>
        <button onClick={onClose} className="cancel-btn">
          Cancel
        </button>
      </div>
    </div>,
    document.body
  );
};

export default MockRazorpay;
