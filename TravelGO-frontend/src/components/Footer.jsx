import React from 'react';
import {  Mail, MapPin, Phone } from 'lucide-react';
import "../style/Footer.css";

const Footer = () => {
  return (
    <footer className="travel-footer">
      <div className="footer-container">
        {/* Brand Section */}
        <div className="footer-brand">
          <h2 className="footer-logo">Travel<span>GO</span></h2>
          <p>Handpicked heritage journeys and curated cultural experiences across the globe.</p>
          
        </div>

        {/* Quick Links */}
        <div className="footer-links">
          <h4>Explore</h4>
          <ul>
            <li>Destinations</li>
            <li>Hotels</li>
            <li>Travel Packages</li>
            <li>Special Deals</li>
          </ul>
        </div>

        {/* Support */}
        <div className="footer-links">
          <h4>Support</h4>
          <ul>
            <li>Help Center</li>
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
            <li>Contact Us</li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-contact">
          <h4>Get in Touch</h4>
          <div className="contact-item">
            <MapPin size={18} /> <span>123 Heritage Lane, Mumbai, India</span>
          </div>
          <div className="contact-item">
            <Phone size={18} /> <span>+91 98765 43210</span>
          </div>
          <div className="contact-item">
            <Mail size={18} /> <span>explore@travelgo.com</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 TravelGO. Explore Smarter, Travel Deeper.</p>
      </div>
    </footer>
  );
};

export default Footer;