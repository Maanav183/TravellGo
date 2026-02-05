import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Hotel } from 'lucide-react';
import api from '../../services/api';

const AddHotel = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Fields matching Hotel Entity
    hotelName: '',
    hotelType: 'Luxury',
    hotelDescription: 'A comfortable stay.', // Default or add input
    hotelAddress: 'City Center', // Default or add input
    city: 'Mumbai', // Default or add input
    rent: '',
    status: 'Available',
    image: '/images/hotel-default.jpg',
    amenities: 'Wifi, AC',
    rating: 4.5
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        hotelName: formData.hotelName,
        hotelType: formData.hotelType,
        hotelDescription: formData.hotelDescription,
        hotelAddress: formData.hotelAddress,
        city: formData.city,
        rent: formData.rent,
        status: formData.status,
        image: formData.image,
        amenities: formData.amenities,
        rating: formData.rating
      };

      await api.admin.addHotel(payload);
      alert("Hotel added to the fleet successfully!");
      navigate('/admin/dashboard');
    } catch (error) {
      console.error("Failed to add hotel", error);
      alert("Failed to add hotel.");
    }
  };

  const handleImageChange = (e) => {
    let val = e.target.value;
    // 1. Replace all backslashes with forward slashes
    val = val.replace(/\\/g, '/');

    // 2. If path contains 'public/', strip everything before it
    if (val.includes('public/')) {
      val = '/' + val.split('public/')[1];
    }
    setFormData({ ...formData, image: val });
  };

  return (
    <div className="admin-form-root">
      <div className="form-container">
        <button onClick={() => navigate(-1)} className="back-btn-text">
          <ArrowLeft size={18} /> Back to Dashboard
        </button>

        <div className="form-header">
          <Hotel size={32} color="#8b0000" />
          <h1>Add New Hotel to Fleet</h1>
        </div>

        <form onSubmit={handleSubmit} className="admin-main-form">
          <div className="form-grid">
            <div className="input-group">
              <label>Hotel Name</label>
              <input
                type="text" required placeholder="e.g. Taj Hotel"
                onChange={(e) => setFormData({ ...formData, hotelName: e.target.value })}
              />
            </div>

            <div className="input-group">
              <label>Hotel Type</label>
              <select onChange={(e) => setFormData({ ...formData, hotelType: e.target.value })}>
                <option value="Luxury">Luxury</option>
                <option value="Budget">Budget</option>
                <option value="Services">Services</option>
              </select>
            </div>

            <div className="input-group">
              <label>City</label>
              <input
                type="text" required placeholder="e.g. Mumbai"
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>

            <div className="input-group">
              <label>Address</label>
              <input
                type="text" placeholder="e.g. Near Station"
                onChange={(e) => setFormData({ ...formData, hotelAddress: e.target.value })}
              />
            </div>

            <div className="input-group">
              <label>Price (₹)</label>
              <input
                type="number" required placeholder="800"
                onChange={(e) => setFormData({ ...formData, rent: e.target.value })}
              />
            </div>

            <div className="input-group">
              <label>Hotel Image URL</label>
              <input
                type="text" placeholder="/images/hotel-default.jpg"
                onChange={handleImageChange}
                value={formData.image}
              />
              {formData.image && (
                <div style={{ marginTop: '10px' }}>
                  <img
                    src={formData.image}
                    alt="Preview"
                    style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #ddd' }}
                    onError={(e) => e.target.style.display = 'none'}
                  />
                </div>
              )}
            </div>
          </div>

          <button type="submit" className="save-btn">
            <Save size={18} /> Save Hotel Details
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddHotel;