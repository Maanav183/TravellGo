import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Bus, Hotel, MapPin, CheckCircle, ArrowLeft, Users, Calendar } from "lucide-react";
import api from '../services/api';
import { toast } from "../components/Toast"; // 🟢 ADDED TOAST IMPORT
import "../style/PackageDetails.css";

const PackageDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { plan, city } = location.state || {};

  const [bookingData, setBookingData] = useState({
    date: "",
    guests: 1,
  });

  // Backend doesn't link Package -> Bus/Hotel yet, so we use defaults
  const allocatedBus = null;
  const allocatedHotel = null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!plan || !city) {
    return (
      <div style={{ padding: "80px 20px", textAlign: "center", minHeight: "100vh" }}>
        <h2>Package not found</h2>
        <p>Please go back and select a package.</p>
        <button
          onClick={() => navigate("/packages")}
          style={{ marginTop: "20px", padding: "12px 24px", background: "#facc15", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}
        >
          Back to Packages
        </button>
      </div>
    );
  }

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // 🟢 Removed misplaced import

  const handlePackageBooking = async () => {
    // 1. Calculate the actual price
    const priceNum = parseFloat(plan.price.toString().replace(/,/g, ""));
    const totalAmount = priceNum * bookingData.guests;

    // 🟢 ENABLE RAZORPAY
    const res = await loadRazorpay();
    if (!res) {
      toast.error("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const options = {
      key: "rzp_test_1DP5mmOlF5G5ag",
      // ... same options
      handler: async function (response) {
        const paymentId = response.razorpay_payment_id;

        try {
          const userStr = localStorage.getItem("user");
          if (!userStr) {
            toast.error("Please login to book a package");
            navigate("/login");
            return;
          }
          const user = JSON.parse(userStr);
          const customerId = user.customer_id || user.Customer_id || user.customerId || user.id;

          const bookDate = bookingData.date || new Date().toISOString().split('T')[0];
          await api.user.bookPackage(customerId, plan.id, bookDate);

          toast.success("Package confirmed! Get ready.");
          navigate("/bookingsuccess", { state: { paymentId } });

        } catch (error) {
          console.error("Package booking failed", error);
          toast.error("Booking failed! Please try again.");
        }
      },
      prefill: {
        name: "Test User",
        email: "testuser@example.com",
        contact: "9999999999"
      },
      theme: { color: "#facc15" },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <div className="package-details-root">
      <div className="details-container">
        <button onClick={() => navigate(-1)} className="back-btn">
          <ArrowLeft size={20} /> Back to Packages
        </button>


        <div className="details-main-grid">
          {/* LEFT SIDE: Content */}
          <div className="plan-info-section">
            <span className="category-tag">{plan.category}</span>
            <h1 className="plan-title">{plan.title}</h1>
            <p className="city-subtitle">
              <MapPin size={18} /> {city.cityName} • {plan.duration}
            </p>

            {/* INCLUSIONS SECTION */}
            <div className="package-inclusions-section">
              <h3 className="section-title">Your Package Includes</h3>
              <div className="inclusions-row">
                <div className="inclusion-card">
                  <div className="inclusion-icon"><Bus size={24} /></div>
                  <div className="inclusion-content">
                    <span className="label">Transport</span>
                    <h4 className="name">{allocatedBus ? allocatedBus.name : "Luxury Bus"}</h4>
                    <p className="sub">{allocatedBus ? allocatedBus.type : "AC Sleeper"}</p>
                  </div>
                </div>

                <div className="inclusion-card">
                  <div className="inclusion-icon"><Hotel size={24} /></div>
                  <div className="inclusion-content">
                    <span className="label">Stay</span>
                    <h4 className="name">{allocatedHotel ? allocatedHotel.name : "Premium Hotel"}</h4>
                    <p className="sub">{allocatedHotel ? `${allocatedHotel.rating} Star Stay` : "Luxury Room"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="highlights-box">
              <h3>Experience highlights</h3>
              <ul>
                {plan.highlights?.map((h, i) => (
                  <li key={i}>
                    <CheckCircle size={18} color="#facc15" /> {h}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* RIGHT SIDE: Booking Card */}
          <aside className="booking-summary-card">
            <div className="price-display">
              <span className="label">Package Total</span>
              <h2>₹{plan.price}</h2>
              <p>per person • All inclusive</p>
            </div>

            <div className="booking-form">
              <div className="input-group">
                <label><Calendar size={16} /> Select Travel Date</label>
                <input
                  type="date"
                  value={bookingData.date}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                />

              </div>

              <div className="input-group">
                <label><Users size={16} /> Number of Guests</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={bookingData.guests}
                  onChange={(e) => setBookingData({ ...bookingData, guests: Number(e.target.value) })}
                />
              </div>

              <div className="total-calculation">
                <span>Subtotal ({bookingData.guests} Guests)</span>
                <strong>
                  ₹{(parseFloat(plan.price.toString().replace(/,/g, "")) * bookingData.guests).toLocaleString("en-IN")}
                </strong>
              </div>

              <button onClick={handlePackageBooking} className="confirm-btn">
                Confirm Package Booking
              </button>
            </div>

            <p className="support-text">Secure payment via TravelGO Gateway</p>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default PackageDetails;