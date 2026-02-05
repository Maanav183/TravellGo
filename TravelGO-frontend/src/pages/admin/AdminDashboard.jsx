import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bus, Hotel, Package, BarChart, Users, ArrowRight, LogOut } from 'lucide-react';
import api from "../../services/api"; // 🟢 Import API
import "../../style/Admin.css";

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    buses: 0,
    hotels: 0,
    packages: 0,
    users: 0 // If we have an endpoint for this, otherwise keep mock or 0
  });
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("token");
    navigate("/");
  };

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    padding: '25px',
    borderRadius: '16px',
    backdropFilter: 'blur(10px)',
    transition: 'transform 0.3s ease'
  };

  const numStyle = { fontSize: '2.2rem', margin: '0 0 8px 0', color: 'white', fontWeight: '800' };
  const labelStyle = { color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px' };

  useEffect(() => {
    // 1. Security Check
    const isAdmin = localStorage.getItem("isAdmin");
    // if (isAdmin !== "true") navigate("/admin/login");

    // 2. Load Real Data from Backend
    const fetchDashboardData = async () => {
      try {
        const [bookingsRes, busesRes, hotelsRes, packagesRes] = await Promise.all([
          api.admin.getAllBookings(),
          api.user.getBuses(),
          api.user.getHotels(),
          api.user.getPackages()
        ]);

        const bookingsData = Array.isArray(bookingsRes.data) ? bookingsRes.data : [];

        // Map Backend Keys to Frontend Expectations
        const mappedBookings = bookingsData.map(b => ({
          id: b.BookingId,
          title: b.BookingTitle,
          type: b.Type,
          date: b.Date,
          totalAmount: b.Price,
          customer: b.CustomerName
        }));

        setBookings(mappedBookings);

        setStats({
          buses: (Array.isArray(busesRes.data) ? busesRes.data : []).length,
          hotels: (Array.isArray(hotelsRes.data) ? hotelsRes.data : []).length,
          packages: (Array.isArray(packagesRes.data) ? packagesRes.data : []).length,
          users: 12 // Mock for now as we don't have getAllUsers endpoint visible
        });

      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  // 3. Math Logic for Stats
  const totalRevenue = bookings.reduce((acc, curr) => {
    // Cleans the amount string (removes ₹ and ,) before adding
    const amt = parseInt(String(curr.totalAmount || 0).replace(/[₹,]/g, '')) || 0;
    return acc + amt;
  }, 0);

  return (
    <div className="admin-dashboard-main" style={{ padding: '30px', maxWidth: '1400px' }}>

      {/* Header with Title & Status */}
      <header style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <h1 style={{ color: 'white', margin: 0, fontSize: '1.8rem' }}>Admin Dashboard</h1>
          <div style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', padding: '5px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
            ● System Online
          </div>
        </div>

        <button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)',
            color: '#ef4444', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
            fontWeight: '600', transition: 'all 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
        >
          <LogOut size={18} /> Logout
        </button>
      </header>

      {/* 🟢 THE 3-COLUMN GRID */}
      <div className="stats-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)', // Forces exactly 3 columns
        gap: '20px',
        marginBottom: '50px'
      }}>

        <div className="stat-card" style={cardStyle}>
          <h3 style={numStyle}>{bookings.length}</h3>
          <p style={labelStyle}>TOTAL BOOKINGS</p>
        </div>

        <div className="stat-card" style={cardStyle}>
          <h3 style={{ ...numStyle, color: '#22c55e' }}>₹{totalRevenue.toLocaleString()}</h3>
          <p style={labelStyle}>TOTAL REVENUE</p>
        </div>

        <div className="stat-card" style={cardStyle}>
          <h3 style={numStyle}>{stats.buses}</h3>
          <p style={labelStyle}>AVAILABLE BUSES</p>
        </div>

        <div className="stat-card" style={cardStyle}>
          <h3 style={numStyle}>{stats.hotels}</h3>
          <p style={labelStyle}>PARTNER HOTELS</p>
        </div>

        <div className="stat-card" style={cardStyle}>
          <h3 style={numStyle}>{stats.users}</h3>
          <p style={labelStyle}>ACTIVE USERS</p>
        </div>

        <div className="stat-card" style={cardStyle}>
          <h3 style={numStyle}>{stats.buses + stats.hotels + stats.packages}</h3>
          <p style={labelStyle}>TOTAL SERVICES</p>
        </div>
      </div>

      <section className="management-section">
        <h2>Quick Actions</h2>
        <div className="action-grid">
          <button onClick={() => navigate('/admin/add-bus')}><Bus /> Add Bus</button>
          <button onClick={() => navigate('/admin/add-hotel')}><Hotel /> Add Hotel</button>
          <button onClick={() => navigate('/admin/add-package')}><Package /> Add Package</button>
          <button className="manage-btn" onClick={() => navigate('/admin/ManageInventory')}><BarChart /> Manage All</button>
        </div>
      </section>

      {/* 🟢 NEW: RECENT BOOKINGS TABLE */}
      <section className="table-section">
        <div className="section-header">
          <h2>Recent Journeys Booked</h2>
          <button onClick={() => navigate('/mybookings')}>View All <ArrowRight size={16} /></button>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Trip Title</th>
                <th>Type</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length > 0 ? bookings.map((b, i) => (
                <tr key={i}>
                  <td><strong>#{String(b.id || '').slice(-6) || 'N/A'}</strong></td>
                  <td>{b.title}</td>
                  <td><span className={`badge ${String(b.type || 'unknown').toLowerCase()}`}>{b.type}</span></td>
                  <td>{b.date}</td>
                  <td>₹{b.totalAmount}</td>
                  <td><span className="status-confirmed">Confirmed</span></td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="no-data">No bookings found yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>

  );
};

export default AdminDashboard;