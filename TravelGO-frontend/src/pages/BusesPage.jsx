import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, Users, IndianRupee, MapPin, Star, X, AlertCircle } from 'lucide-react';
import { jsPDF } from "jspdf";
import api from '../services/api'; // Import API
import { useAuth } from '../hooks/useAuth'; // 🟢 Import Hook
import MockRazorpay from '../components/MockRazorpay'; // 🟢 Import Mock Payment
import '../style/BusesPage.css';

const BusesPage = () => {
  const navigate = useNavigate();
  const { user, getCustomerId } = useAuth(); // 🟢 Use Hook
  const [buses, setBuses] = useState([]);
  const [filteredBuses, setFilteredBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBus, setSelectedBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]); // ✅ Added state
  const [travellers, setTravellers] = useState([]);
  const [activeReviewBus, setActiveReviewBus] = useState(null);
  const [bookingStage, setBookingStage] = useState('list');

  // Fetch Buses from Backend
  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const response = await api.user.getBuses();
        // Map backend fields
        const mappedBuses = response.data.map(bus => ({
          id: bus.busId,
          routeId: bus.routeId, // ✅ Mapped routeId
          agency: bus.travelAgency,
          type: bus.busType,
          route: bus.route || "Route info unavailable",
          capacity: bus.capacity,
          seats: bus.capacity,
          price: bus.fare,
          image: bus.image || "/HomePage/bus.jpg",
          rating: bus.rating || 4.2,
          reviews: []
        }));
        setBuses(mappedBuses);
        setFilteredBuses(mappedBuses);
      } catch (error) {
        console.error("Failed to fetch buses", error);
        // alert("Failed to connect to server. Please ensure backend is running."); // Optional: Don't alert yet, just log
      } finally {
        setLoading(false);
      }
    };

    fetchBuses();
  }, []);

  // Sync travellers array with selected seats
  useEffect(() => {
    setTravellers(prev => {
      if (selectedSeats.length === prev.length) return prev;
      if (selectedSeats.length < prev.length) return prev.slice(0, selectedSeats.length);

      const newItemsCount = selectedSeats.length - prev.length;
      const newItems = Array.from({ length: newItemsCount }, (_, i) => ({
        name: '',
        age: '',
        seat: selectedSeats[prev.length + i]
      }));
      return [...prev, ...newItems];
    });
  }, [selectedSeats]);

  const handleSearch = () => {
    const query = searchTerm.toLowerCase();
    const results = buses.filter(bus =>
      bus.route.toLowerCase().includes(query) ||
      bus.agency.toLowerCase().includes(query)
    );
    setFilteredBuses(results);
  };

  const toggleSeat = (seatId) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleTravellerChange = (index, field, value) => {
    const updated = [...travellers];
    updated[index][field] = value;
    setTravellers(updated);
  };

  const totalFare = selectedBus ? selectedBus.price * selectedSeats.length : 0;

  // --- INSIDE BUSESPAGE COMPONENT ---

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Fetch Booked Seats when a bus is selected
  useEffect(() => {
    if (selectedBus && bookingStage === 'seating') {
      const fetchBookedSeats = async () => {
        try {
          // Backend uses routeId. The bus object now needs routeId.
          // In fetchBuses, we didn't map routeId. We need to fix that first.
          // Assuming routeId is available or we default.
          // Wait, response.data in fetchBuses has bus definitions. 
          // Does it have routeId? Bus entity has it now.
          // So I need to update fetchBuses mapping key.
          if (selectedBus.routeId) {
            const res = await api.user.getBookedSeats(selectedBus.routeId);
            setBookedSeats(res.data || []); // Array of seat numbers
          }
        } catch (err) {
          console.error("Failed to fetch seat availability", err);
        }
      };
      fetchBookedSeats();
    }
  }, [selectedBus, bookingStage]);

  // 🟢 State for Payment Modal
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleWrapperBooking = () => {
    const customerId = getCustomerId();
    if (!user || !customerId) {
      alert("Please login to book tickets");
      navigate('/login');
      return;
    }
    setShowPaymentModal(true);
  };

  const onPaymentSuccess = async () => {
    setShowPaymentModal(false);
    // Proceed to Real Booking
    await performBooking();
  };

  const performBooking = async () => {
    try {
      const customerId = getCustomerId();
      // Book each seat
      for (const seat of selectedSeats) {
        await api.user.bookBus(customerId, selectedBus.routeId, selectedBus.id, seat);
      }

      alert("Payment & Booking Successful! 🎟️");
      navigate('/bookingsuccess');

    } catch (error) {
      console.error("Booking failed", error);
      alert("Booking failed: " + (error.response?.data?.message || error.message));
    }
  };

  const handleBusBooking = handleWrapperBooking; // Remap for existing button call
  const downloadTicket = () => {
    const doc = new jsPDF();
    const bookingId = "HH" + Math.floor(100000 + Math.random() * 900000);
    const primaryColor = [139, 0, 0];
    const secondaryColor = [15, 23, 42];

    // Header
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 45, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.text("TRAVELLGO", 105, 25, { align: "center" });
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Premium Intercity Travel Experience", 105, 35, { align: "center" });

    // Booking ID
    doc.setTextColor(...secondaryColor);
    doc.setFont("helvetica", "bold");
    doc.text(`BOOKING ID: ${bookingId}`, 140, 60);
    doc.text(`DATE: ${new Date().toLocaleDateString()}`, 140, 68);

    // Journey Details
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.5);
    doc.line(20, 75, 190, 75);
    doc.setFontSize(16);
    doc.text("JOURNEY DETAILS", 20, 85);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Travel Agency: ${selectedBus.agency}`, 20, 95);
    doc.text(`Bus Type: ${selectedBus.type}`, 20, 103);
    doc.setFont("helvetica", "bold");
    doc.text(`Route: ${selectedBus.route}`, 20, 111);

    // Passenger Table
    doc.setFillColor(248, 249, 250);
    doc.rect(20, 120, 170, 10, 'F');
    doc.setFontSize(11);
    doc.text("Passenger Name", 25, 127);
    doc.text("Age", 120, 127);
    doc.text("Seat", 160, 127);

    doc.setFont("helvetica", "normal");
    travellers.forEach((t, i) => {
      const y = 138 + (i * 10);
      doc.text(`${i + 1}. ${t.name}`, 25, y);
      doc.text(`${t.age}`, 120, y);
      doc.text(`${t.seat}`, 160, y);
      doc.setDrawColor(220, 220, 220);
      doc.line(20, y + 3, 190, y + 3);
    });

    // Payment Summary
    const summaryY = 160 + (travellers.length * 10);
    doc.setFillColor(...secondaryColor);
    doc.rect(130, summaryY, 60, 25, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("TOTAL PAID", 140, summaryY + 10);
    doc.setFontSize(16);
    doc.text(`INR ${totalFare}`, 140, summaryY + 18);

    // Footer
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    const footerY = 260;
    doc.text("Terms & Conditions:", 20, footerY);
    doc.text("1. Please report 15 mins before departure.", 20, footerY + 5);
    doc.text("2. Carry a valid ID proof during travel.", 20, footerY + 10);
    doc.text("3. This is a computer-generated e-ticket.", 20, footerY + 15);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primaryColor);
    doc.text("Thank you for choosing TravellGO!", 105, 285, { align: "center" });

    doc.save(`TravellGO_Ticket_${bookingId}.pdf`);
  };

  if (loading) return (
    <div className="loader-container">
      <Loader2 className="animate-spin text-maroon" size={48} />
      <p>Finding available routes...</p>
    </div>
  );

  return (
    <div className="buses-page-root">
      <section className="buses-hero">
        <div className="hero-overlay">
          <h1 className="buses-page-title">
            Intercity <span className="highlight-text">Bus</span> services
          </h1>
          <h3>Comfortable journeys across destinations</h3>
        </div>
      </section>

      <div className="buses-container">
        <div className="buses-hero-search">
          <div className="search-pill-container">
            <div className="search-input-wrapper">
              <Search size={20} className="search-icon-dim" />
              <input
                type="text"
                placeholder="Search by city or travel agency..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()} // ✅ ADDED: Search on Enter key
                className="unified-search-input"
              />
            </div>
            <button className="search-btn" onClick={handleSearch}>
              Find Buses
            </button>
          </div>
        </div>

        <div className="bus-cards-grid">
          {filteredBuses.length === 0 ? (
            <div className="no-results">
              <AlertCircle size={48} />
              <p>No buses found matching your search.</p>
            </div>
          ) : (
            filteredBuses.map((bus) => (
              <motion.div key={bus.id} className="bus-card" whileHover={{ y: -5 }}>
                <div className="bus-image-wrapper">
                  <img src={bus.image} alt={bus.agency} />
                </div>
                <div className="bus-info-content">
                  <div className="bus-card-header">
                    <div className="agency-info">
                      <h3>{bus.agency}</h3>
                      <span className="bus-tag">{bus.type}</span>
                    </div>
                  </div>
                  <div className="bus-details">
                    <p><MapPin size={20} className="text-maroon" /> {bus.route}</p>
                    <p><Users size={20} className="text-slate-500" /> {bus.capacity} Seats Available</p>
                  </div>
                  <div className="reviews-preview" onClick={() => setActiveReviewBus(bus)}>
                    <div className="rating-badge">
                      <Star size={16} fill="#fbbf24" color="#fbbf24" />
                      <span>{bus.rating || 0} / 5</span>
                    </div>
                    <p className="latest-review">"{bus.reviews?.[0]?.comment || "Great journey!"}"</p>
                  </div>
                  <div className="bus-card-footer">
                    <div className="price-tag">
                      <IndianRupee size={28} />
                      <span>{bus.price}</span>
                    </div>
                    <button className="select-btn" onClick={() => {
                      setSelectedBus(bus);
                      setSelectedSeats([]);
                      setTravellers([]); // 
                      setBookingStage('seating');
                    }}>Select Seats</button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      <AnimatePresence>
        {bookingStage === 'seating' && selectedBus && (
          <motion.div
            className="booking-overlay-portal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="portal-content-wrapper">
              <div className="portal-header">
                <button className="back-to-list-btn" onClick={() => setBookingStage('list')}>
                  <X size={18} /> Back to Listing
                </button>
                <div className="bus-info-header">
                  <h2>{selectedBus.agency || selectedBus.name}</h2>
                  <span>{selectedBus.route} • {selectedBus.type}</span>
                </div>
                <div className="header-status-pill">Step 2: Passenger & Seat Selection</div>
              </div>

              <div className="portal-body-grid">
                <div className="traveller-entry-section">
                  <h3 className="section-title">Passenger Details</h3>
                  <div className="traveller-scroll-area">
                    {selectedSeats.length > 0 ? selectedSeats.map((seatId, index) => (
                      <motion.div
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        key={seatId}
                        className="passenger-input-card"
                      >
                        <div className="passenger-header">
                          <Users size={14} /> Passenger {index + 1} <strong>(Seat {seatId})</strong>
                        </div>
                        <div className="input-row">
                          <div className="input-field">
                            <label>Full Name</label>
                            <input
                              type="text"
                              placeholder="Enter Name"
                              value={travellers[index]?.name || ''}
                              onChange={(e) => handleTravellerChange(index, 'name', e.target.value)}
                            />
                          </div>
                          <div className="input-field age">
                            <label>Age</label>
                            <input
                              type="number"
                              placeholder="Age"
                              value={travellers[index]?.age || ''}
                              onChange={(e) => handleTravellerChange(index, 'age', e.target.value)}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )) : (
                      <div className="no-selection-notice">
                        <AlertCircle size={40} />
                        <p>Please select your preferred seats from the bus map to continue.</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="seat-map-section">
                  <div className="bus-chassis">
                    <div className="steering-indicator">
                      <div className="wheel-icon">🎡</div>
                      <span>DRIVER AREA</span>
                    </div>

                    <div className="seats-layout-grid-unified">
                      {[...Array(24)].map((_, i) => {
                        const seatId = `${i + 1}`; // Use simple numbers as backend stores "1", "2" etc. or keep "S1" if that's what we want.
                        // Backend likely stores pure strings. Let's stick to "S1" format if that's what we send.
                        // But wait, user might just enter "1". Let's assume we send "S1".
                        // Actually, let's stick to "S{i+1}" for consistency.
                        const seatLabel = `S${i + 1}`;
                        const isBooked = bookedSeats.includes(seatLabel);
                        const isSelected = selectedSeats.includes(seatLabel);

                        return (
                          <React.Fragment key={seatLabel}>
                            <button
                              disabled={isBooked}
                              className={`seat-unit-box ${isBooked ? 'booked' : ''} ${isSelected ? 'selected' : ''}`}
                              onClick={() => toggleSeat(seatLabel)}
                            >
                              <div className="seat-handle"></div>
                              {seatLabel}
                            </button>
                            {(i + 1) % 2 === 0 && (i + 1) % 4 !== 0 && <div className="bus-aisle"></div>}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>

                  <div className="seat-legend">
                    <div className="legend-item"><span className="box available"></span> Available</div>
                    <div className="legend-item"><span className="box selected"></span> Selected</div>
                    <div className="legend-item"><span className="box booked"></span> Booked</div>
                  </div>

                  <div className="floating-summary-card">
                    <div className="summary-row">
                      <span>Selected Seats:</span>
                      <strong>{selectedSeats.join(', ') || 'None'}</strong>
                    </div>
                    <div className="summary-row total">
                      <span>Total Fare:</span>
                      <strong>₹{totalFare}</strong>
                    </div>
                    <button
                      className="confirm-pay-btn"
                      disabled={selectedSeats.length === 0}
                      onClick={() => handleBusBooking(selectedBus)}
                    >
                      Proceed to Book
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeReviewBus && (
          <motion.div className="review-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="review-modal">
              <div className="modal-header">
                <h3>{activeReviewBus.agency} Reviews</h3>
                <button onClick={() => setActiveReviewBus(null)}><X /></button>
              </div>
              <div className="modal-body">
                {activeReviewBus.reviews?.map((rev, idx) => (
                  <div key={idx} className="review-item">
                    <div className="review-user-info"><strong>{rev.user}</strong> <span>{"★".repeat(rev.stars)}</span></div>
                    <p>{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🟢 Mock Payment Modal */}
      {showPaymentModal && (
        <MockRazorpay
          amount={totalFare}
          onSuccess={onPaymentSuccess}
          onClose={() => setShowPaymentModal(false)}
        />
      )}
    </div>
  );
};

export default BusesPage;