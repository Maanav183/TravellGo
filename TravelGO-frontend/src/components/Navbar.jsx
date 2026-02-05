import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Map, User, Search, X, Compass, ShieldCheck } from 'lucide-react';
import "../style/Navbar.css";


const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // States for scroll and search
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // 🟢 Logic: Check if current route is Home
  const isHome = location.pathname === '/home';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Shrinks the navbar after 20px of scrolling
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    /* 🟢 Logic: Apply 'nav-solid-bar' if NOT on home page */
    <nav className={`floating-nav-container ${!isHome ? 'nav-solid-bar' : ''} ${isScrolled ? 'scrolled' : ''}`}>
      <div className={`nav-pill ${isSearchOpen ? 'search-active' : ''}`}>

        {/* CUSTOM LOGO */}
        {!isSearchOpen && (
          <Link to="/home" className="pill-logo">
            <div className="logo-text">
              Travel<span className="logo-highlight">GO</span>
            </div>
          </Link>
        )}

        {/* Labeled Search Bar */}
        <div className={`nav-search-wrapper ${isSearchOpen ? 'expanded' : ''}`}>
          <form onSubmit={(e) => {
            e.preventDefault();
            if (searchTerm.trim()) {
              navigate(`/packageslist?search=${encodeURIComponent(searchTerm)}`);
              setIsSearchOpen(false);
              setSearchTerm('');
            }
          }} className="search-form">
            <Search size={18} className="search-inside-icon" />
            <input
              type="text"
              placeholder="Where to?"
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
          <button className="search-toggle-btn" onClick={() => setIsSearchOpen(!isSearchOpen)}>
            {isSearchOpen ? <X size={18} /> : <span>Search</span>}
          </button>
        </div>

        {/* Links (Hidden when searching) */}
        {!isSearchOpen && (
          <ul className="pill-links">
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/destinations">Destinations</Link></li>
            <li><Link to="/hotels">Hotels</Link></li>
            <li><Link to="/packageslist">Packages</Link></li>
            <li><Link to="/buses">Buses</Link></li>
          </ul>
        )}

        {/* Labeled Action Buttons */}
        <div className="pill-actions">
          {!isSearchOpen && (
            <Link to="/mybookings" className="labeled-action">
              <Map size={18} />
              <span>Bookings</span>
            </Link>
          )}
          <button className="user-profile-btn" onClick={() => {
            const token = localStorage.getItem("authToken");
            if (token) {
              navigate('/dashboard');
            } else {
              navigate('/login');
            }
          }}>
            <User size={18} />
            <span>Account</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;