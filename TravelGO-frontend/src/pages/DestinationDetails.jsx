/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
// 🟢 CLEANUP: Removed duplicate destinations import
import { destinations } from "../data/destinations";
import ReviewSection from '../components/ReviewSection';
import BookingModal from '../components/BookingModal';
import StreetViewModal from '../components/StreetViewModal';
import {
  Camera, MapPin, Clock, Star, ChevronRight,
  CheckCircle2, Hotel, Utensils, Car, Map, ShieldCheck
} from 'lucide-react';
import "../style/DestinationDetails.css";
import "../style/OlaStyle.css"; // 🟢 Import Ola Styles
import { itineraryData } from '../data/itineraryData';

const DestinationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeDay, setActiveDay] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [streetViewOpen, setStreetViewOpen] = useState(false);
  const [streetViewImage, setStreetViewImage] = useState('');
  const [streetViewCoords, setStreetViewCoords] = useState(null);
  const [streetViewEmbedUrl, setStreetViewEmbedUrl] = useState(null); // 🟢 Add State

  // Find the specific itinerary for this package
  const currentItinerary = itineraryData[id] || itineraryData["delhi-package"];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const destination = destinations.find(d => d.id === id);

  // 🟢 FIXED: Defined inclusions as a simple array instead of a broken function
  const inclusions = [
    { icon: <Hotel size={20} />, text: "Premium Accommodation", sub: "Handpicked 4-star hotels" },
    { icon: <Utensils size={20} />, text: "Daily Breakfast", sub: "Buffet & local delicacies" },
    { icon: <Car size={20} />, text: "Private Transport", sub: "Airport transfers & local travel" },
    { icon: <Map size={20} />, text: "Expert Guide", sub: "Certified local storytellers" },
  ];

  const handleBookRedirect = () => {
    if (destination) {
      navigate('/packageslist', { state: { targetCityId: destination.id } });
    }
  };

  const handleDownloadPDF = () => {
    const fileName = `${destination.id}-brochure.pdf`;
    const pdfUrl = `/brochures/${fileName}`;

    const link = document.createElement("a");
    link.href = pdfUrl;
    link.setAttribute("download", `${destination.name}_Brochure.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!destination) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50 font-sans">
        <MapPin size={48} className="text-slate-300 mb-4" />
        <h1 className="text-2xl font-bold text-slate-800">Destination not found</h1>
        <button onClick={() => navigate(-1)} className="mt-4 text-blue-600 font-semibold">Go Back</button>
      </div>
    );
  }

  return (
    <div className="dest-details-page-root">
      {/* 1. Hero Section */}
      <div className="dest-hero-section">
        <img src={`/images/${destination.id}.jpg`} alt={destination.name} className="dest-hero-image" />
        <div className="dest-hero-overlay">
          <div className="dest-hero-container">
            <h1 className="dest-hero-title">{destination.name}</h1>
            <div className="dest-hero-meta">
              <Clock size={20} /> <span>{destination.nights}N / {destination.days}D • All-Inclusive Experience</span>
            </div>
          </div>
        </div>
      </div>

      <div className="details-content-grid">
        <div className="main-info-column">
          {/* Highlights Section */}
          <section className="highlights-section">
            <h2 className="section-title">Trip Highlights</h2>
            <div className="highlights-grid">
              {destination.features?.map((feature, index) => (
                <div key={index} className="highlight-item">
                  <div className="highlight-icon-box">
                    <CheckCircle2 size={24} className="icon-maroon" />
                  </div>
                  <div className="highlight-text-box">
                    <h3>{feature} Experience</h3>
                    <p>Included in your {destination.name} itinerary.</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Quick Facts */}
          <section className="dest-section">
            <div className="quick-facts-grid">
              <div className="fact-card">
                <span className="fact-label">Best Time</span>
                <span className="fact-value">
                  {['agra', 'delhi', 'jaipur'].includes(destination.id) ? "Oct - March" : "Year Round"}
                </span>
              </div>
              <div className="fact-card">
                <span className="fact-label">Ideal For</span>
                <span className="fact-value">Adventurers & Explorers</span>
              </div>
              <div className="fact-card">
                <span className="fact-label">Local Transport</span>
                <span className="fact-value">Cabs & Rickshaws</span>
              </div>
            </div>
          </section>

          {/* Attractions */}
          <section className="dest-section">
            <h3 className="dest-section-title">Must-Visit Attractions</h3>
            <div className="dest-attractions-grid">
              {destination.attractions?.map((spot, index) => (
                <div
                  key={index}
                  className="dest-attraction-card"
                  onClick={() => {
                    // Always set the image for fallback
                    setStreetViewImage(spot.image);

                    if (spot.lat && spot.lng) {
                      setStreetViewCoords({ lat: spot.lat, lng: spot.lng });
                    } else {
                      setStreetViewCoords(null);
                    }
                    setStreetViewEmbedUrl(spot.embedUrl || null); // 🟢 Set Embed URL
                    setStreetViewOpen(true);
                  }}
                >
                  <div className="dest-attraction-image-wrapper">
                    <img src={spot.image} alt={spot.name} className="dest-attraction-img" />

                    {/* 🟢 Ola Street View Badge */}
                    <div className="ola-street-view-badge">
                      <MapPin size={16} fill="#a3e635" className="text-black" />
                      <span>Ola Street View</span>
                    </div>

                    <div className="dest-attraction-icon-overlay"><Camera size={24} /></div>
                  </div>
                  <div className="dest-attraction-content">
                    <h4 className="dest-attraction-name">{spot.name}</h4>
                    <p className="dest-attraction-desc">{spot.desc}</p>
                    <button className="view-360-btn">
                      View 360°
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Inclusions */}
          <section className="inclusions-section">
            <h2 className="section-title">What's Included</h2>
            <div className="inclusions-list">
              {inclusions.map((item, index) => (
                <div key={index} className="inclusion-card">
                  <div className="inclusion-icon">{item.icon}</div>
                  <div className="inclusion-content">
                    <h4>{item.text}</h4>
                    <p>{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* itinerary  */}
          <section className="itinerary-preview-section">
            <div className="itinerary-preview-card">
              <div className="preview-info">
                <h2 className="preview-title">Detailed Day-Wise Itinerary</h2>
                <p className="preview-subtitle">
                  Explore every stop, food recommendation, and local secret we've planned for your {destination.name} adventure.
                </p>
              </div>
              <button
                className="view-itinerary-cta"
                onClick={() => navigate(`/itinerary/${destination.id}`)}
              >
                <span>View Full {destination.days}-Day Plan</span>
                <ChevronRight size={20} />
              </button>
            </div>
          </section>

          {/* Sidebar */}
          <aside className="dest-sidebar">
            <div className="dest-booking-card">
              <div className="dest-price-header">
                <span className="dest-price-label">Starting Price</span>
                <h2 className="dest-price-value">₹{destination.price}</h2>
              </div>
              <div className="dest-quick-stats">
                <div className="dest-stat-pill"><Clock size={16} /> {destination.nights}N/{destination.days}D</div>
                <div className="dest-stat-pill"><Star size={16} fill="#eab308" stroke="none" /> 4.9/5 Rating</div>
              </div>
              <button className="dest-btn-primary" onClick={handleBookRedirect}>
                Book My Trip <ChevronRight size={20} />
              </button>
              <button className="dest-btn-secondary" onClick={handleDownloadPDF}>
                Download PDF Brochure
              </button>
            </div>
          </aside>
        </div>

        <div className="dest-review-section-wrapper">
          <ReviewSection reviews={destination?.reviews || []} />
        </div>

        <BookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          destinationName={destination.name}
        />

        {/* 🟢 Unified Ola Maps Street View Modal */}
        <StreetViewModal
          isOpen={streetViewOpen}
          onClose={() => {
            setStreetViewOpen(false);
            setStreetViewCoords(null);
          }}
          imageSrc={streetViewImage}
          title={destination?.name}
          lat={streetViewCoords?.lat}
          lng={streetViewCoords?.lng}
          embedUrl={streetViewEmbedUrl} // 🟢 Pass Prop
        />
      </div>
    </div>
  );
};

export default DestinationDetails;