import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ArrowLeft, Save } from 'lucide-react';
import api from '../../services/api';

const AddPackage = () => {
  const navigate = useNavigate();

  // We are not linking specific bus/hotel IDs to package entity as per current backend entity.
  // We will just let admin define the package properties.

  const [formData, setFormData] = useState({
    packageName: '',
    city: 'agra', // Default city
    cost: '',
    duration: '3 Days, 2 Nights',
    packageType: 'Family',
    packageDescription: 'A wonderful trip.',
    highlights: "Sightseeing Included, Breakfast Included",
    rating: 4.5,
    image: '/images/package-default.jpg'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        packageName: formData.packageName,
        city: formData.city,
        cost: formData.cost,
        duration: formData.duration,
        packageType: formData.packageType,
        packageDescription: formData.packageDescription,
        highlights: formData.highlights,
        rating: formData.rating,
        image: formData.image
      };

      await api.admin.addPackage(payload);
      alert("Mega Package Created!");
      navigate('/admin/dashboard');

    } catch (error) {
      console.error("Failed to add package", error);
      alert("Failed to add package.");
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
          <Package size={32} color="#8b0000" />
          <h1>Create New All-Inclusive Package</h1>
        </div>

        <form onSubmit={handleSubmit} className="admin-main-form">
          <div className="form-grid">
            <div className="input-group">
              <label>Package Title</label>
              <input type="text" required placeholder="e.g. Royal Agra Escape"
                onChange={(e) => setFormData({ ...formData, packageName: e.target.value })} />
            </div>

            <div className="input-group">
              <label>Destination City</label>
              <select
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'other') {
                    setFormData({ ...formData, city: '' });
                  } else {
                    setFormData({ ...formData, city: val });
                  }
                }}
              >
                <option value="agra">Agra</option>
                <option value="goa">Goa</option>
                <option value="delhi">Delhi</option>
                <option value="jaipur">Jaipur</option>
                <option value="kashmir">Kashmir</option>
                <option value="manali">Manali</option>
                <option value="mumbai">Mumbai</option>
                <option value="other">Other (Add New)</option>
              </select>

              {/* Conditional Input for Custom City */}
              {(formData.city === '' || !['agra', 'goa', 'delhi', 'jaipur', 'kashmir', 'manali', 'mumbai'].includes(formData.city)) && (
                <input
                  type="text"
                  placeholder="Enter custom city name"
                  style={{ marginTop: '10px' }}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                />
              )}
            </div>

            <div className="input-group">
              <label>Package Type</label>
              <select onChange={(e) => setFormData({ ...formData, packageType: e.target.value })}>
                <option value="Family">Family</option>
                <option value="Honeymoon">Honeymoon</option>
                <option value="Adventure">Adventure</option>
                <option value="Solo">Solo</option>
              </select>
            </div>

            <div className="input-group">
              <label>Duration</label>
              <input type="text" placeholder="e.g. 3 Days 2 Nights"
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })} />
            </div>

            <div className="input-group">
              <label>Base Package Price (₹)</label>
              <input type="number" required placeholder="5000"
                onChange={(e) => setFormData({ ...formData, cost: e.target.value })} />
            </div>

            <div className="input-group">
              <label>Package Image URL</label>
              <input type="text" placeholder="/images/package-default.jpg"
                onChange={handleImageChange}
                value={formData.image} />
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
            <Save size={18} /> Finalize Mega Package
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPackage;