import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Bus } from 'lucide-react';
import api from '../../services/api';

const AddBus = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Fields matching Bus Entity
    travelAgency: '',
    busType: 'AC Sleeper',
    departureTime: '',
    arrivalTime: '', // Added this
    fare: '',
    capacity: 40, // Default or input?
    busNumber: '', // Added this if needed or mapping name to travelAgency
    image: '/images/bus-default.jpg',
    routeFrom: '',
    routeTo: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        travelAgency: formData.travelAgency,
        busType: formData.busType,
        departureTime: formData.departureTime,
        arrivalTime: formData.arrivalTime || "00:00", // Default if not in form
        fare: formData.fare,
        capacity: formData.capacity,
        image: formData.image,
        route: `${formData.routeFrom} - ${formData.routeTo}`
      };

      await api.admin.addBus(payload);
      alert("Bus added to the fleet successfully!");
      navigate('/admin/dashboard');
    } catch (error) {
      console.error("Failed to add bus", error);
      alert("Failed to add bus. Please try again.");
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
          <Bus size={32} color="#8b0000" />
          <h1>Add New Bus to Fleet</h1>
        </div>

        <form onSubmit={handleSubmit} className="admin-main-form">
          <div className="form-grid">
            <div className="input-group">
              <label>Travel Agency / Bus Name</label>
              <input
                type="text" required placeholder="e.g. Maharaja Express"
                onChange={(e) => setFormData({ ...formData, travelAgency: e.target.value })}
              />
            </div>

            <div className="input-group">
              <label>Bus Type</label>
              <select onChange={(e) => setFormData({ ...formData, busType: e.target.value })}>
                <option value="AC Sleeper">AC Sleeper</option>
                <option value="Non-AC Sleeper">Non-AC Sleeper</option>
                <option value="Premium Multi-Axle">Premium Multi-Axle</option>
              </select>
            </div>

            <div className="input-group">
              <label>Departure Time</label>
              <input
                type="time" required
                onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
              />
            </div>

            <div className="input-group">
              <label>Arrival Time</label>
              <input
                type="time" required
                onChange={(e) => setFormData({ ...formData, arrivalTime: e.target.value })}
              />
            </div>

            <div className="input-group">
              <label>Source (From)</label>
              <input
                type="text" required placeholder="e.g. Delhi"
                onChange={(e) => setFormData({ ...formData, routeFrom: e.target.value })}
              />
            </div>

            <div className="input-group">
              <label>Destination (To)</label>
              <input
                type="text" required placeholder="e.g. Jaipur"
                onChange={(e) => setFormData({ ...formData, routeTo: e.target.value })}
              />
            </div>

            <div className="input-group">
              <label>Price (₹)</label>
              <input
                type="number" required placeholder="800"
                onChange={(e) => setFormData({ ...formData, fare: e.target.value })}
              />
            </div>

            <div className="input-group">
              <label>Bus Image URL</label>
              <input
                type="text" placeholder="/images/bus-default.jpg"
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
            <Save size={18} /> Save Bus Details
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBus;