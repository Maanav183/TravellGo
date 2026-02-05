import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Star, ArrowLeft } from "lucide-react";
import "../style/writeReview.css";

const WriteReview = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get Hotel ID
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    comment: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (rating === 0) {
      alert("Please select a star rating.");
      return;
    }

    // 1. Create the new review object
    const newReview = {
      hotelId: Number(id), // Link review to specific hotel
      user: formData.name, // Map 'name' to 'user' to match existing structure
      rating: rating,
      text: formData.comment, // Map 'comment' to 'text'
      date: new Date().toLocaleDateString()
    };

    // 2. Get existing reviews from LocalStorage
    const existingReviews = JSON.parse(localStorage.getItem("hotel_reviews")) || [];

    // 3. Add new review to the list
    const updatedReviews = [newReview, ...existingReviews];

    // 4. Save back to LocalStorage
    localStorage.setItem("hotel_reviews", JSON.stringify(updatedReviews));

    alert("Thank you! Your review has been posted.");
    navigate(-1); // Go back to Hotel Details
  };

  return (
    <div className="write-review-page">
      <div className="review-container">
        
        {/* Header */}
        <div className="review-header-row">
          <button onClick={() => navigate(-1)} className="back-btn">
            <ArrowLeft size={24} />
          </button>
          <h2>Write a Review</h2>
        </div>
        <p className="review-intro">Share your experience to help others.</p>

        <form onSubmit={handleSubmit} className="review-form">
          
          {/* Star Rating Input */}
          <div className="rating-input-group">
            <label>Overall Rating</label>
            <div className="star-row">
              {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                  <label key={index}>
                    <input 
                      type="radio" 
                      name="rating" 
                      value={ratingValue} 
                      onClick={() => setRating(ratingValue)}
                    />
                    <Star 
                      size={32} 
                      className="star-icon" 
                      fill={ratingValue <= (hover || rating) ? "#eab308" : "transparent"} 
                      stroke={ratingValue <= (hover || rating) ? "#eab308" : "#cbd5e1"}
                      onMouseEnter={() => setHover(ratingValue)}
                      onMouseLeave={() => setHover(0)}
                    />
                  </label>
                );
              })}
            </div>
          </div>

          {/* Text Inputs */}
          <div className="form-group">
            <label>Name</label>
            <input 
              type="text" 
              placeholder="Your Name" 
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              placeholder="your@email.com" 
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Your Review</label>
            <textarea 
              rows="5" 
              placeholder="What did you like or dislike?" 
              required
              value={formData.comment}
              onChange={(e) => setFormData({...formData, comment: e.target.value})}
            ></textarea>
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-review-btn">
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default WriteReview;