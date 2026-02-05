import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar, Users, MapPin, Bus, Hotel, ArrowRight, ShieldCheck } from 'lucide-react';
import "../style/BookingSuccess.css";

const BookingSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { plan, type, item, bookingData, totalAmount, paymentId, allocatedBus, allocatedHotel } = location.state || {};

  if (!location.state) {
    return <div className="error-state"><h2>No booking found.</h2><button onClick={() => navigate('/')}>Home</button></div>;
  }

  return (
    <div className="success-page-root">
      <div className="success-card">
        <div className="success-header">
          <div className="check-badge"><CheckCircle size={50} /></div>
          <h1>Booking Confirmed!</h1>
          <p>Payment ID: <span>{paymentId}</span></p>
        </div>

        <div className="ticket-body">
          {/* 🟢 DYNAMIC TITLE: Works for Packages, Buses, or Hotels */}
          <div className="ticket-main-info">
            <h3>{plan?.title || item?.name || "Travel Booking"}</h3>
            <p><MapPin size={16} /> {location.state.city?.cityName || item?.city || "Confirmed Location"}</p>
          </div>

          <div className="info-grid">
            <div className="info-box">
              <Calendar size={18} />
              <div><span>Date</span><p>{bookingData?.date || "Today"}</p></div>
            </div>
            <div className="info-box">
              <Users size={18} />
              <div><span>Guests</span><p>{bookingData?.guests || 1} Persons</p></div>
            </div>
          </div>

          {/* 🟢 CONDITIONAL INCLUSIONS */}
          <div className="ticket-inclusions">
            {/* If it's a Package, show both */}
            {plan && (
              <>
                <div className="mini-row"><Bus size={18} /> <p>{allocatedBus?.name}</p></div>
                <div className="mini-row"><Hotel size={18} /> <p>{allocatedHotel?.name}</p></div>
              </>
            )}
            {/* If it was a solo Bus booking */}
            {type === 'bus' && <div className="mini-row"><Bus size={18} /> <p>{item?.type} Class</p></div>}
            {/* If it was a solo Hotel booking */}
            {type === 'hotel' && <div className="mini-row"><Hotel size={18} /> <p>{item?.rating} Star Rating</p></div>}
          </div>

          <div className="ticket-divider"></div>

          <div className="ticket-footer">
            <div className="total-label">Amount Paid</div>
            <div className="total-value">₹{totalAmount?.toLocaleString("en-IN")}</div>
          </div>
        </div>

        <div className="trust-badge">
          <ShieldCheck size={16} /> Secure Booking by TravelGO
        </div>

        <button onClick={() => navigate('/home')} className="home-btn">
          Back to Dashboard <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default BookingSuccess;