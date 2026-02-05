import React, { useState, useEffect } from 'react';
import { Trash2, Bus, Hotel, Package, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import "../../style/Admin.css"; // Ensure your styling is linked
import "../../style/Admin.css"; // Ensure your styling is linked

const AdminManage = () => {
  const navigate = useNavigate();

  // 🟢 State Definitions
  const [activeTab, setActiveTab] = useState('buses');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🟢 Fetch Data Effect
  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      let response;
      if (activeTab === 'buses') {
        response = await api.user.getBuses();
      } else if (activeTab === 'hotels') {
        response = await api.user.getHotels();
      } else {
        response = await api.user.getPackages();
      }
      setData(response.data || []);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (item) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        if (activeTab === 'buses') {
          await api.admin.deleteBus(item.busId);
        } else if (activeTab === 'hotels') {
          await api.admin.deleteHotel(item.hotelId);
        } else {
          await api.admin.deletePackage(item.packageId);
        }
        // Refresh data
        fetchData();
      } catch (error) {
        console.error("Failed to delete", error);
        alert("Failed to delete item.");
      }
    }
  };

  // Helper to get display properties based on type
  const getDisplayProps = (item) => {
    if (activeTab === 'buses') {
      return {
        id: item.busId,
        title: item.travelAgency,
        subtitle: `${item.busType} • ${item.departureTime} - ${item.arrivalTime}`,
        price: item.fare,
        image: item.image || "/images/bus-default.jpg"
      };
    } else if (activeTab === 'hotels') {
      return {
        id: item.hotelId,
        title: item.hotelName,
        subtitle: `${item.hotelType} • ${item.city}`,
        price: item.rent,
        image: item.image || "/images/hotel-default.jpg"
      };
    } else {
      return {
        id: item.packageId,
        title: item.packageName,
        subtitle: `${item.duration} • ${item.packageType}`,
        price: item.cost,
        image: item.image || "/images/package-default.jpg"
      };
    }
  };

  return (
    <div className="admin-manage-root" style={{ background: '#0f172a', minHeight: '100vh', padding: '40px', color: 'white' }}>

      <div className="manage-header" style={{ marginBottom: '40px' }}>
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="back-link"
          style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}
        >
          <ArrowLeft size={20} /> Back to Dashboard
        </button>

        <h1 style={{ fontSize: '2rem', marginBottom: '25px' }}>Inventory Management</h1>

        {/* 🟢 TAB GROUP: 3-Column Style */}
        <div className="tab-group" style={{ display: 'flex', gap: '15px', background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '12px', width: 'fit-content' }}>
          <button
            className={activeTab === 'buses' ? 'active' : ''}
            onClick={() => setActiveTab('buses')}
            style={tabButtonStyle(activeTab === 'buses')}
          >
            <Bus size={18} /> Buses
          </button>
          <button
            className={activeTab === 'hotels' ? 'active' : ''}
            onClick={() => setActiveTab('hotels')}
            style={tabButtonStyle(activeTab === 'hotels')}
          >
            <Hotel size={18} /> Hotels
          </button>
          <button
            className={activeTab === 'cityPackages' ? 'active' : ''}
            onClick={() => setActiveTab('cityPackages')}
            style={tabButtonStyle(activeTab === 'cityPackages')}
          >
            <Package size={18} /> Packages
          </button>
        </div>
      </div>

      {/* 🟢 INVENTORY LIST: 3-Column Grid */}
      <div className="inventory-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '20px'
      }}>
        {loading ? <p>Loading...</p> : (data.length > 0 ? data.map(item => {
          const display = getDisplayProps(item);
          return (
            <div key={display.id} className="manage-item-card" style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)',
              padding: '20px',
              borderRadius: '15px',
              display: 'flex',
              gap: '15px',
              alignItems: 'center'
            }}>
              {/* Image Thumbnail */}
              <div style={{ width: '60px', height: '60px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0 }}>
                <img src={display.image} alt={display.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => e.target.style.display = 'none'} />
              </div>

              <div className="item-details" style={{ flexGrow: 1 }}>
                <h4 style={{ margin: '0 0 5px 0', color: '#f8fafc' }}>{display.title}</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>
                  {display.subtitle} • ₹{display.price}
                </p>
              </div>
              <button
                className="delete-btn"
                onClick={() => handleDelete(item)}
                style={{ background: 'rgba(239, 68, 68, 0.1)', border: 'none', padding: '10px', borderRadius: '8px', color: '#ef4444', cursor: 'pointer' }}
              >
                <Trash2 size={18} />
              </button>
            </div>
          )
        }) : (
          <p style={{ gridColumn: 'span 3', textAlign: 'center', color: '#64748b', marginTop: '40px' }}>
            No items found in this category.
          </p>
        ))}
      </div>
    </div>
  );
};

// Helper style function for tabs
const tabButtonStyle = (isActive) => ({
  background: isActive ? '#3b82f6' : 'transparent',
  color: isActive ? 'white' : '#94a3b8',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '8px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontWeight: '600',
  transition: 'all 0.3s ease'
});

export default AdminManage;