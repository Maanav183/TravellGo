import React from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // 1. Import Hooks
import { Star, User, CheckCircle } from 'lucide-react';
import "../style/ReviewSection.css";

const ReviewSection = ({ reviews }) => {
  const navigate = useNavigate(); // 2. Initialize navigation
  const { id } = useParams();     // 3. Get the hotel ID from the URL (parent route)

  // Calculate average rating safely
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / reviews.length).toFixed(1) 
    : "5.0";

  return (
    <div className="review-section-container">
      <div className="review-header">
        <div>
          <h3 className="review-title">Traveler Stories</h3>
          <p className="review-subtitle">Real experiences from our community</p>
        </div>
        <div className="review-stats">
          <div className="star-rating-total">
            <Star size={24} fill="#eab308" stroke="none" />
            <span>{averageRating}</span>
          </div>
          <p className="verified-count">{reviews.length} Verified Reviews</p>
        </div>
      </div>

      <div className="reviews-list">
        {reviews.map((review, index) => (
          <div key={index} className="individual-review-card">
            <div className="review-user-info">
              <div className="user-avatar">
                <User size={20} className="avatar-icon" />
              </div>
              <div className="user-meta">
                <div className="name-wrapper">
                  <h4 className="user-name">{review.user || "Aman S."}</h4>
                  <CheckCircle size={14} className="verified-icon" />
                </div>
                <span className="review-date">Jan 2026</span>
              </div>
            </div>
            
            <div className="star-rating-row">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill={i < (review.rating || 5) ? "#eab308" : "#475569"} stroke="none" />
              ))}
            </div>
            
            <p className="review-comment">"{review.comment || review.text}"</p>
          </div>
        ))}
      </div>

      {/* 4. Updated Button with Navigation Event */}
      <button 
        className="write-review-btn"
        onClick={() => navigate(`/write-review/${id}`)}
      >
        Write a Review +
      </button>
    </div>
  );
};

export default ReviewSection;