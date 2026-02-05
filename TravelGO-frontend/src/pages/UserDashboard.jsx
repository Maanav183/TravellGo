import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Map, Clock, MessageSquare, LogOut, Loader2, Calendar, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import api from "../services/api";
import "../style/UserDashboard.css";

const UserDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("profile");
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState({ bookings: 0, reviews: 0 });
    const [history, setHistory] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: "",
        phoneNo: "",
        address: ""
    });

    useEffect(() => {
        const fetchUserData = async () => {
            const userStr = localStorage.getItem("user");
            if (!userStr) {
                navigate("/login");
                return;
            }

            try {
                const userData = JSON.parse(userStr);
                setUser(userData);

                // Initialize edit form
                setEditForm({
                    name: userData.name || userData.customerName || "",
                    phoneNo: userData.phoneNo || userData.mobileNo || "",
                    address: userData.address || ""
                });

                // Backend provides "customer_id" or "Customer_id" or "id"
                const customerId = userData.customer_id || userData.Customer_id || userData.customerId || userData.id;

                if (customerId) {
                    // Fetch History (Bookings + Tickets) and Reviews
                    const [ticketsRes, bookingsRes, reviewsRes] = await Promise.all([
                        api.user.getTickets(customerId).catch(err => ({ data: [] })),
                        api.user.getBookings(customerId).catch(err => ({ data: [] })),
                        api.user.getReviews(customerId).catch(err => ({ data: [] }))
                    ]);

                    // Merge Tickets and Bookings for History
                    const tickets = (ticketsRes.data || []).map(t => ({
                        id: t.ticketId,
                        title: t.bus?.travelAgency || "Bus Ride",
                        date: t.route?.dateOfJourney || "N/A",
                        status: t.status,
                        type: "Bus",
                        image: t.bus?.image,
                        detail: `${t.route?.routeFrom} - ${t.route?.routeTo}`
                    }));

                    const otherBookings = (bookingsRes.data || []).map(b => ({
                        id: b.bookingId,
                        title: b.hotel?.hotelName || b.packages?.packageName || "Booking",
                        date: b.bookingDate,
                        status: "Confirmed",
                        type: b.hotel ? "Hotel" : "Package",
                        image: b.hotel?.image || "/HomePage/package.jpg",
                        detail: b.description
                    }));

                    setHistory([...tickets, ...otherBookings]);
                    setReviews(reviewsRes.data || []);
                    setStats({
                        bookings: tickets.length + otherBookings.length,
                        reviews: (reviewsRes.data || []).length
                    });
                }

            } catch (error) {
                console.error("Failed to parse user data or fetch dashboard info", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        alert("Logged out successfully!");
        navigate("/login");
    };

    const handleUpdateProfile = async () => {
        // Validation (Basic)
        if (!editForm.phoneNo || !editForm.address) {
            alert("Address and Mobile number cannot be empty.");
            return;
        }

        try {
            setLoading(true);
            const customerId = user.customer_id || user.Customer_id || user.customerId || user.id;

            // Prepare payload (Only send what we edit)
            const payload = {
                name: editForm.name,
                phoneNo: editForm.phoneNo,
                address: editForm.address
            };

            const response = await api.user.updateUser(customerId, payload);

            if (response.status === 200) {
                // Update local state
                const updatedUser = { ...user, ...editForm };
                setUser(updatedUser);
                localStorage.setItem("user", JSON.stringify(updatedUser)); // Persist
                setIsEditing(false);
                api.toast?.success ? api.toast.success("Profile updated!") : alert("Profile updated successfully!");
            }
        } catch (error) {
            console.error("Update failed", error);
            alert("Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    const displayValue = (val) => {
        if (!val || val === "" || val === "null") return "-";
        return val;
    };

    if (loading) return (
        <div className="dashboard-loading">
            <Loader2 className="animate-spin text-blue-600" size={48} />
        </div>
    );

    return (
        <div className={`dashboard-container ${!isSidebarOpen ? "sidebar-collapsed" : ""}`}>
            {/* Sidebar */}
            <aside className={`dashboard-sidebar ${!isSidebarOpen ? "collapsed" : ""}`}>
                <button
                    className="sidebar-toggle-btn"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
                >
                    {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                </button>

                <div className="profile-summary">
                    <div className="profile-pic">
                        {user?.name ? user.name.charAt(0).toUpperCase() : (user?.customerName ? user.customerName.charAt(0).toUpperCase() : "U")}
                    </div>
                    {isSidebarOpen && (
                        <div className="profile-text fade-in">
                            <h3>{user?.name || user?.customerName || "User"}</h3>
                            <p>{user?.email || "No Email"}</p>
                        </div>
                    )}
                </div>

                <nav className="dashboard-nav">
                    <button
                        className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveTab('profile')}
                        title="Profile"
                    >
                        <User size={18} />
                        {isSidebarOpen && <span>Profile</span>}
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'history' ? 'active' : ''}`}
                        onClick={() => setActiveTab('history')}
                        title="History"
                    >
                        <Clock size={18} />
                        {isSidebarOpen && <span>History</span>}
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'reviews' ? 'active' : ''}`}
                        onClick={() => setActiveTab('reviews')}
                        title="My Reviews"
                    >
                        <MessageSquare size={18} />
                        {isSidebarOpen && <span>My Reviews</span>}
                    </button>
                    <div className="nav-divider"></div>
                    <button className="nav-item logout" onClick={handleLogout} title="Logout">
                        <LogOut size={18} />
                        {isSidebarOpen && <span>Logout</span>}
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="dashboard-content">
                {activeTab === 'profile' && (
                    <div className="content-section fade-in">
                        <h2>My Profile</h2>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <h4>Total Bookings</h4>
                                <span className="stat-value">{stats.bookings}</span>
                            </div>
                            <div className="stat-card">
                                <h4>Reviews Given</h4>
                                <span className="stat-value">{stats.reviews}</span>
                            </div>
                        </div>

                        <div className="detail-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
                                <h3 style={{ margin: 0, border: 'none', padding: 0 }}>Personal Information</h3>
                                {!isEditing ? (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        style={{ background: '#2563eb', color: 'white', padding: '0.4rem 1rem', fontSize: '0.9rem' }}
                                    >
                                        Edit Details
                                    </button>
                                ) : (
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            style={{ background: '#64748b', color: 'white', padding: '0.4rem 1rem', fontSize: '0.9rem' }}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleUpdateProfile}
                                            style={{ background: '#16a34a', color: 'white', padding: '0.4rem 1rem', fontSize: '0.9rem' }}
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="info-row">
                                <label>Full Name:</label>
                                <span>{displayValue(user?.name || user?.customerName)}</span>
                            </div>
                            <div className="info-row">
                                <label>Email:</label>
                                <span>{displayValue(user?.email)}</span>
                            </div>

                            <div className="info-row">
                                <label>Mobile:</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editForm.phoneNo}
                                        onChange={(e) => setEditForm({ ...editForm, phoneNo: e.target.value })}
                                        className="edit-input"
                                        style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid #ccc', flex: '0 0 200px', textAlign: 'right' }}
                                    />
                                ) : (
                                    <span>{displayValue(user?.phoneNo || user?.mobileNo)}</span>
                                )}
                            </div>

                            <div className="info-row">
                                <label>Address:</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editForm.address}
                                        onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                                        className="edit-input"
                                        style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid #ccc', flex: '0 0 300px', textAlign: 'right' }}
                                    />
                                ) : (
                                    <span>{displayValue(user?.address)}</span>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className="content-section fade-in">
                        <h2>Travel History</h2>
                        <div className="history-list">
                            {history.length === 0 ? (
                                <p className="empty-state">No travel history yet. Start exploring!</p>
                            ) : history.map((item, idx) => (
                                <div key={idx} className="history-item">
                                    <div className="item-icon">
                                        {item.type === 'Bus' ? <MapPin size={20} /> : <Map size={20} />}
                                    </div>
                                    <div className="item-details">
                                        <h4>{item.title}</h4>
                                        <p className="item-sub">{item.detail}</p>
                                        <span className="item-date"><Calendar size={12} /> {item.date}</span>
                                    </div>
                                    <div className="item-status">
                                        <span className={`status-badge ${item.status ? item.status.toLowerCase() : 'confirmed'}`}>
                                            {item.status || 'Confirmed'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'reviews' && (
                    <div className="content-section fade-in">
                        <h2>My Reviews</h2>
                        <div className="reviews-list">
                            {reviews.length === 0 ? (
                                <p className="empty-state">You haven't written any reviews yet.</p>
                            ) : reviews.map((rev, idx) => (
                                <div key={idx} className="review-card">
                                    <div className="review-header">
                                        <span className="stars">{"★".repeat(rev.rating)}</span>
                                        <span className="review-date">{rev.submitDate}</span>
                                    </div>
                                    <p>"{rev.feedback}"</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default UserDashboard;
