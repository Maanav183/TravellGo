import React, { useEffect, useRef } from "react";
import "../style/StreetViewModal.css";

const GoogleStreetViewModal = ({ isOpen, onClose, lat, lng, title }) => {
  const streetViewRef = useRef(null);

  useEffect(() => {
    if (!isOpen || !lat || !lng) return;

    // Ensure Google Maps script is loaded
    if (!window.google || !window.google.maps) {
      console.error("Google Maps JS API not loaded");
      return;
    }

    // eslint-disable-next-line no-unused-vars
    const panorama = new window.google.maps.StreetViewPanorama(
      streetViewRef.current,
      {
        position: { lat, lng },
        pov: { heading: 34, pitch: 10 },
        zoom: 1,
        addressControl: false,
        fullscreenControl: false,
        motionTracking: false,
      }
    );

    return () => {
      // cleanup
      if (streetViewRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        streetViewRef.current.innerHTML = "";
      }
    };
  }, [isOpen, lat, lng]);

  if (!isOpen) return null;

  return (
    <div className="streetview-backdrop">
      <div className="streetview-modal">
        <div className="streetview-header">
          <h2>{title} – Street View</h2>
          <button className="streetview-close" onClick={onClose}>✕</button>
        </div>

        {/* 🔥 GOOGLE STREET VIEW RENDERS HERE */}
        <div className="streetview-body" ref={streetViewRef} />

        <div className="streetview-footer">
          <button className="reset-btn" onClick={onClose}>Reset View</button>
        </div>
      </div>
    </div>
  );
};

export default GoogleStreetViewModal;
