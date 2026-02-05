import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { itineraryData } from '../data/itineraryData';
import { ArrowLeft, Clock, MapPin,Utensils } from 'lucide-react';
import { packingData } from '../data/itineraryData';
import { Briefcase } from 'lucide-react';
import '../style/FullItinerary.css';
import { foodGuideData } from '../data/itineraryData';

const FullItinerary = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const plan = itineraryData[id] || [];
  const foods = foodGuideData[id] || [];
  const packingList = packingData[id] || [];

  return (
    <div className="full-itinerary-root">
      {/* Header with Back Button */}
      <div className="itinerary-nav-header">
        <button onClick={() => navigate(-1)} className="back-btn">
          <ArrowLeft size={20} /> Back to Details
        </button>
        <h1>Full Journey Plan: {id.charAt(0).toUpperCase() + id.slice(1)}</h1>
      </div>

      <div className="itinerary-timeline">
        {plan.map((day, index) => (
          <div key={index} className="day-card-full">
            <div className="day-sidebar">
              <div className="day-number">{day.day}</div>
              <div className="day-line"></div>
            </div>
            
            <div className="day-main-content">
              <div className="day-image-container">
                <img src={day.image} alt={day.title} />
                <span className="day-time-tag"><Clock size={14} /> {day.time}</span>
              </div>
              
            <div className="day-text-content">
  <span className="day-label">Day {day.day}</span>
  {/* Ensure the icon and title are inside the H2 */}
  <h2>{day.icon} {day.title}</h2> 
  <p className="day-description">{day.description}</p>
  
  <div className="day-tags">
    {day.tags.map((tag, i) => (
      <span key={i} className="tag">#{tag}</span>
    ))}
  </div>
</div>
            </div>
          </div>
        ))}
      </div>

      {/* 🍴 NEW: Food Guide Section */}
    <section className="food-guide-section">
      <div className="food-header">
        <Utensils size={28} className="text-maroon" />
        <h2>Local Culinary Highlights</h2>
      </div>
      <p className="food-intro">Don't leave {id} without trying these local favorites:</p>
      
      <div className="food-grid">
        {foods.map((food, index) => (
          <div key={index} className="food-card">
            <div className="food-icon">{food.icon}</div>
            <div className="food-info">
              <h3>{food.name}</h3>
              <p>{food.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>

    <section className="packing-section">
      <div className="packing-header">
        <Briefcase size={28} />
        <h2>Travel Essentials</h2>
      </div>
      <div className="packing-grid">
        {packingList.map((tip, index) => (
          <div key={index} className="packing-item">
            <span className="check-box">✓</span>
            <div>
              <strong>{tip.item}</strong>
              <p>{tip.reason}</p>
            </div>
          </div>
        ))}
      </div>
      </section>
  </div>
    

  );
};

export default FullItinerary;