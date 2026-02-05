import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import "../style/DestinationsPage.css"; 

const DestinationCard = ({ destination }) => {
  return (
    <div className="dest-card-container">
      {/* 1. Standardized Image Area */}
      <div className="dest-card-image">
        <img 
          src={`/images/${destination.id}.jpg`} 
          alt={destination.name}
          className="dest-img-standard"
        />
        <div className="dest-price-badge">
          ₹{destination.price}
        </div>
      </div>

      {/* 2. Standardized Content Area */}
      <div className="dest-card-body">
        <div className="dest-meta">
          <MapPin size={14} className="dest-pin-icon" />
          <span>{destination.duration.toUpperCase()}</span>
        </div>
        
        <h3 className="dest-title">{destination.name}</h3>
        
        <p className="dest-description">
          {destination.description || destination.tagline}
        </p>

        {/* 3. The Fixed Maroon Button */}
        <Link 
          to={`/destinations/${destination.id}`} 
          className="dest-maroon-btn"
        >
          View Details <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
};

export default DestinationCard;