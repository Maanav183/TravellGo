import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  MapPin, Calendar, Users, Trash2, AlertCircle, X,
  MessageCircle, Send, Ticket, Hotel as HotelIcon,
  Map as MapIcon, Download, Hash, Clock
} from 'lucide-react';
import { jsPDF } from "jspdf";
import api from '../services/api';
import { toast } from '../components/Toast'; // 🟢 Added Toast
import "../style/MyBookings.css";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [activeSupport, setActiveSupport] = useState(null);

  // 🟢 Helper to get image based on city
  const getLocationImage = (city) => {
    if (!city) return null;
    const lowerCity = city.toLowerCase();
    if (lowerCity.includes('agra')) return '/images/agra.jpg';
    if (lowerCity.includes('delhi')) return '/images/delhi.jpg';
    if (lowerCity.includes('goa')) return '/images/goa.jpg';
    if (lowerCity.includes('jaipur')) return '/images/jaipur.jpg';
    if (lowerCity.includes('kashmir') || lowerCity.includes('srinagar') || lowerCity.includes('gulmarg')) return '/images/kashmir.jpg';
    if (lowerCity.includes('manali')) return '/images/manali.jpg';
    if (lowerCity.includes('mumbai')) return '/images/mumbai.jpg';
    return null;
  };

  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
          setLoading(false);
          return;
        }

        const user = JSON.parse(userStr);
        const customerId = user.customerId || user.customer_id;

        if (!customerId) {
          console.error("No customer ID found");
          setLoading(false);
          return;
        }

        // Fetch concurrently
        const [ticketsRes, bookingsRes] = await Promise.all([
          api.user.getTickets(customerId),
          api.user.getBookings(customerId)
        ]);

        const tickets = (ticketsRes.data || []).map(t => ({
          id: `BUS-${t.ticketId}`,
          type: 'Bus',
          title: t.bus?.travelAgency || 'Bus Journey',
          date: t.route?.dateOfJourney || 'Upcoming',
          totalAmount: t.bus?.fare || 0,
          paymentId: `TKT-${t.ticketId}`,
          image: t.bus?.image || getLocationImage(t.route?.routeTo) || "/HomePage/buses.png",
          seats: t.seatNumber,
          guests: 1,
          status: t.status,
          // Rich details for Bus
          description: `${t.bus?.busType || 'Bus'} - ${t.route?.routeFrom} to ${t.route?.routeTo}`,
          location: `${t.route?.routeFrom} → ${t.route?.routeTo}`,
          rating: t.bus?.rating || 4.5, // Default or fetch
          amenities: t.bus?.amenities ? t.bus.amenities.split(',') : ['AC', 'Sleeper']
        }));

        const validBookings = (bookingsRes.data || []).filter(b => {
          // Check Hotel Validity
          const hotelData = (Array.isArray(b.hotels) && b.hotels.length > 0) ? b.hotels[0] : b.hotel;
          const isHotelValid = hotelData && hotelData.hotelName && hotelData.city;

          // Check Package Validity
          const packageData = (Array.isArray(b.packages) && b.packages.length > 0) ? b.packages[0] : b.packages;
          const isPackageValid = packageData && packageData.packageName && packageData.city;

          return isHotelValid || isPackageValid;
        });

        const otherBookings = validBookings.map(b => {
          let type = 'Unknown';
          let title = 'Booking';
          let image = '/placeholder.jpg';
          let amount = 0;
          let details = {};
          let location = '';
          let rating = 0;
          let description = '';
          let features = []; // Amenities or Highlights

          // 🟢 FIX: Handle both Array (OneToMany) and Object (ManyToOne legacy) cases
          const hotelData = (Array.isArray(b.hotels) && b.hotels.length > 0) ? b.hotels[0] : b.hotel;
          const packageData = (Array.isArray(b.packages) && b.packages.length > 0) ? b.packages[0] : b.packages;

          if (hotelData) {
            type = 'Hotel';
            title = hotelData.hotelName;
            image = hotelData.image;
            amount = hotelData.rent;
            location = `${hotelData.hotelAddress}, ${hotelData.city}`;
            rating = hotelData.rating;
            description = hotelData.hotelDescription;
            if (hotelData.amenities) features = hotelData.amenities.split(',');
            details.nights = 1;
          } else if (packageData) {
            type = 'Package';
            title = packageData.packageName;
            image = packageData.image || getLocationImage(packageData.city) || '/HomePage/Packages.png';
            amount = packageData.cost;
            location = packageData.city;
            rating = packageData.rating;
            description = packageData.packageDescription;
            if (packageData.highlights) features = packageData.highlights.split(',');
            details.duration = packageData.duration;
          }

          return {
            id: `BKG-${b.bookingId}`,
            type,
            title,
            date: b.travelDate || b.bookingDate || 'Upcoming',
            totalAmount: amount,
            paymentId: `PAY-${b.bookingId}`,
            image,
            guests: b.numberOfTravelers || 1,
            status: 'Confirmed',
            // Rich Details
            location,
            rating,
            description,
            amenities: features,
            ...details
          };
        });

        setBookings([...tickets, ...otherBookings]);
      } catch (err) {
        console.error("Failed to fetch bookings", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyBookings();
  }, []);

  const generateInvoice = (booking) => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("TravelGO - Invoice", 20, 20);

    // Details
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Booking ID: ${booking.id}`, 20, 40);
    doc.text(`Service: ${booking.title}`, 20, 50);
    doc.text(`Type: ${booking.type}`, 20, 60);
    doc.text(`Date: ${booking.date}`, 20, 70);
    doc.text(`Amount Paid: ₹${booking.totalAmount}`, 20, 80);
    doc.text(`Payment ID: ${booking.paymentId || 'N/A'}`, 20, 90);

    toast.success("Invoice downloaded! 📄");
    doc.save(`Invoice_${booking.title.replace(/\s+/g, '_')}.pdf`);
  };

  const handlePrintTicket = (booking) => {
    // You can implement a detailed ticket print function here
    alert(`Printing ticket for ${booking.title}`);
  };

  const confirmCancel = (id) => {
    const updated = bookings.filter(b => b.id !== id);
    setBookings(updated);
    localStorage.setItem('allBookings', JSON.stringify(updated));
    setCancellingId(null);
  };

  if (loading) {
    return <div className="loading-state">Loading your adventures...</div>;
  }

  return (
    <div className="bookings-page-container">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <header className="mb-12">
          <h1 className="text-5xl font-black text-slate-900 mb-2">My Journeys</h1>
          <p className="text-slate-500">Your upcoming heritage explorations and stays.</p>
        </header>

        {bookings.length === 0 ? (
          <div className="empty-bookings">
            <MapIcon size={64} className="text-slate-500 mb-4 opacity-50" />
            <p className="text-xl font-bold text-slate-400">No upcoming adventures yet!</p>
            <Link to="/packageslist" className="explore-btn-yellow">
              Start Exploring
            </Link>
          </div>
        ) : (
          <div className="bookings-grid">
            <AnimatePresence mode='popLayout'>
              {bookings.map((booking) => (
                <motion.div
                  key={booking.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="booking-card"
                >
                  {/* LEFT: Image & Type */}
                  <div className="card-media">
                    <img
                      src={booking.image || getLocationImage(booking.location) || "/HomePage/Packages.png"}
                      alt={booking.title}
                      onError={(e) => { e.target.src = getLocationImage(booking.location) || "/HomePage/Packages.png"; }}
                    />
                    <div className="type-badge">
                      {booking.type === 'Bus' ? <Ticket size={12} /> :
                        booking.type === 'Hotel' ? <HotelIcon size={12} /> :
                          <MapIcon size={12} />}
                      {booking.type}
                    </div>
                  </div>

                  {/* CENTER: Details */}
                  <div className="card-content">
                    <div className="card-header">
                      <div className="header-top">
                        <h3>{booking.title}</h3>
                        <div className="rating-stars">
                          {"★".repeat(Math.round(booking.rating || 5))}
                          <span className="rating-text">({booking.rating || 5}/5)</span>
                        </div>
                      </div>
                      <div className="location-row">
                        <MapPin size={14} />
                        <span>{booking.location || "Unknown Location"}</span>
                      </div>
                    </div>

                    <div className="card-body">
                      <p className="description-text">
                        {booking.description ?
                          (booking.description.length > 120 ? booking.description.substring(0, 120) + "..." : booking.description)
                          : "Experience an unforgettable journey with TravelGO."}
                      </p>

                      {booking.amenities && booking.amenities.length > 0 && (
                        <div className="amenities-tags">
                          {booking.amenities.slice(0, 4).map((tag, idx) => (
                            <span key={idx} className="amenity-tag">{tag.trim()}</span>
                          ))}
                          {booking.amenities.length > 4 && <span className="amenity-tag">+{booking.amenities.length - 4} more</span>}
                        </div>
                      )}
                    </div>

                    <div className="card-meta">
                      <div className="meta-item">
                        <Calendar size={16} />
                        <span>{booking.date}</span>
                      </div>
                      <div className="meta-item">
                        <Users size={16} />
                        <span>{booking.guests} Guest(s)</span>
                      </div>
                      {booking.details?.duration && (
                        <div className="meta-item">
                          <Clock size={16} /> {/* Requires Clock import */}
                          <span>{booking.details.duration}</span>
                        </div>
                      )}
                      {booking.details?.nights && (
                        <div className="meta-item">
                          <Clock size={16} />
                          <span>{booking.details.nights} Night(s)</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* RIGHT: Action Stub */}
                  <div className="card-actions">
                    <span className={`status-pill ${booking.status?.toLowerCase() || 'confirmed'}`}>
                      {booking.status || 'Confirmed'}
                    </span>

                    <div className="price-box">
                      <span className="label">Total Paid</span>
                      <span className="amount">₹{booking.totalAmount?.toLocaleString()}</span>
                    </div>

                    <div className="action-buttons">
                      <button className="btn-invoice" onClick={() => generateInvoice(booking)}>
                        <Download size={14} /> Invoice
                      </button>
                      <div className="icon-actions">
                        <button onClick={() => setActiveSupport(booking)} title="Support">
                          <MessageCircle size={18} />
                        </button>
                        <button onClick={() => setCancellingId(booking.id)} title="Cancel" className="btn-delete">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* SUPPORT MODAL */}
      <AnimatePresence>
        {activeSupport && (
          <div className="modal-overlay" onClick={() => setActiveSupport(null)}>
            <motion.div
              className="support-modal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="support-header">
                <div className="support-user">
                  <div className="online-indicator" />
                  <div>
                    <h3>TravelGO Support</h3>
                  </div>
                </div>
                <button onClick={() => setActiveSupport(null)}>
                  <X size={20} />
                </button>
              </div>
              <div className="support-body">
                <div className="message bot">
                  How can we help with your booking for {activeSupport.title}?
                </div>
              </div>
              <div className="support-footer">
                <input type="text" placeholder="Type message..." />
                <button className="send-msg-btn">
                  <Send size={18} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CANCELLATION MODAL */}
      <AnimatePresence>
        {cancellingId && (
          <div className="modal-overlay" onClick={() => setCancellingId(null)}>
            <motion.div
              className="cancel-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <AlertCircle size={48} className="warning-icon" />
              <h2>Cancel Booking?</h2>
              <p>Are you sure you want to cancel this trip? This action cannot be undone.</p>
              <div className="cancel-modal-actions">
                <button onClick={() => setCancellingId(null)}>
                  Keep Booking
                </button>
                <button
                  className="confirm-delete-btn"
                  onClick={() => confirmCancel(cancellingId)}
                >
                  Cancel Now
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyBookings;