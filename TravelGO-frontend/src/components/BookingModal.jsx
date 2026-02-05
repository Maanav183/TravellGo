import React from 'react';
import { useNavigate } from 'react-router-dom'; // Correct import
import { X, Calendar, Users, MapPin, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import "../style/BookingModal.css";

const BookingModal = ({ isOpen, onClose, destinationName }) => {
  const navigate = useNavigate(); // 1. Initialize the hook inside the component

  // 2. We don't need "if (!isOpen) return null" here because AnimatePresence 
  // handles the mounting/unmounting based on the condition in the parent.

  const handleProceed = (e) => {
    e.preventDefault(); // Prevent form reload
    onClose(); // Close the modal
    navigate('/PaymentCheckout'); // Navigate to your new checkout page
  };

  return (
    <AnimatePresence>
      {isOpen && ( // 3. Wrap content in the condition for AnimatePresence to work
        <div className="modal-overlay" onClick={onClose}>
          <motion.div
            className="modal-content-card"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close-btn" onClick={onClose}>
              <X size={24} />
            </button>

            <div className="modal-header">
              <h2 className="modal-title">Confirm Your Journey</h2>
              <div className="modal-dest-tag">
                <MapPin size={16} /> {destinationName}
              </div>
            </div>

            {/* 4. Attach handleProceed to onSubmit */}
            <form className="modal-form" onSubmit={handleProceed}>
              <div className="input-group">
                <label><Calendar size={16} /> Preferred Date</label>
                <input type="date" required min={new Date().toISOString().split('T')[0]} />
              </div>

              <div className="input-group">
                <label><Users size={16} /> Travelers</label>
                <select>
                  <option>1 Adult</option>
                  <option>2 Adults</option>
                  <option>Family (2+2)</option>
                </select>
              </div>

              <div className="booking-summary-box">
                <div className="summary-row">
                  <span>Base Fare</span>
                  <span>Calculated at Checkout</span>
                </div>
                <p className="summary-note">Taxes and fees will be applied based on your selection.</p>
              </div>

              <button type="submit" className="modal-confirm-btn">
                <CreditCard size={18} /> Proceed to Payment
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BookingModal;