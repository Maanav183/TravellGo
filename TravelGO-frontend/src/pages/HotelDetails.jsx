import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // ✅ ADDED useNavigate
import BookingModal from "../components/BookingModal";
import ReviewSection from "../components/ReviewSection";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import api from '../services/api';
import { Loader2 } from "lucide-react";
import { toast } from "../components/Toast"; // 🟢 ADDED TOAST IMPORT

// ICONS
import {
  MapPin,
  Star,
  Wifi,
  Coffee,
  Shield,
  IndianRupee,
  Calendar,
  Users,
  Navigation,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon
} from "lucide-react";

// STYLES
import "../style/hotelDetails.css";

// --- LEAFLET ICON FIX ---
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// --- HELPER FUNCTIONS ---
const getNearbyAttractions = (cityId) => {
  const attractions = {
    agra: ["Taj Mahal", "Agra Fort", "Mehtab Bagh"],
    delhi: ["India Gate", "Qutub Minar", "Red Fort"],
    goa: ["Baga Beach", "Fort Aguada", "Dudhsagar Falls"],
    jaipur: ["Hawa Mahal", "Amber Fort", "City Palace"],
    kashmir: ["Dal Lake", "Gulmarg Gondola", "Shalimar Bagh"],
    manali: ["Rohtang Pass", "Hadimba Temple", "Solang Valley"],
    mumbai: ["Gateway of India", "Marine Drive", "Juhu Beach"]
  };
  return attractions[cityId?.toLowerCase()] || ["City Center", "Local Market", "Museum"];
};

const calculateNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 1;
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 1;
};

// Default Static Reviews
const defaultReviews = [
  { user: "Rahul K.", rating: 5, text: "Absolutely stunning property. The views were breathtaking!" },
  { user: "Sarah M.", rating: 4, text: "Great service and amenities. The food was slightly spicy but delicious." },
  { user: "Amit V.", rating: 5, text: "Best stay of my life. Highly recommended for couples." }
];

const HotelsDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // ✅ ADDED

  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch Hotel
  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const response = await api.user.getHotels();
        // Find the specific hotel
        // Backend ID is int, params ID is string. Compare carefully.
        const foundBackend = response.data.find(h => String(h.hotelId) === String(id));

        if (foundBackend) {
          const mappedHotel = {
            id: foundBackend.hotelId,
            name: foundBackend.hotelName,
            type: foundBackend.hotelType,
            desc: foundBackend.hotelDescription,
            cityId: foundBackend.city,
            price: foundBackend.rent,
            image: "/HomePage/hotels.jpeg",
            rating: 4.5,
            amenities: ["Wifi", "Pool", "Restaurant"],
            interiorImg1: null,
            interiorImg2: null,
            interiorImg3: null,
            location: { lat: 20.5937, lng: 78.9629 } // Default location
          };
          setHotel(mappedHotel);
        } else {
          setHotel(null);
        }

      } catch (error) {
        console.error("Failed to fetch hotel details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHotel();
  }, [id]);


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviews, setReviews] = useState(defaultReviews);

  // Booking State
  const [dates, setDates] = useState({ checkIn: "", checkOut: "" });
  const [guests, setGuests] = useState("2 Adults");

  // Slider State
  const [currentSlide, setCurrentSlide] = useState(0);

  // Load Reviews
  useEffect(() => {
    const storedReviews = JSON.parse(localStorage.getItem("hotel_reviews")) || [];
    const hotelSpecificReviews = storedReviews.filter((r) => r.hotelId === Number(id));
    setReviews([...hotelSpecificReviews, ...defaultReviews]);
  }, [id]);

  useEffect(() => {
    if (!hotel || galleryImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [currentSlide, hotel]);

  if (loading) {
    return (
      <div className="loader-container" style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
        <Loader2 className="animate-spin text-maroon" size={48} />
      </div>
    );
  }

  // Early return if no hotel
  if (!hotel) {
    return (
      <div style={{ color: 'black', textAlign: 'center', padding: '50px' }}>
        <h2>Hotel Not Found</h2>
        <p>We couldn't find a hotel with ID: {id}</p>
        <button onClick={() => navigate('/hotels')} style={{ marginTop: '20px', padding: '10px 20px' }}>Back to Hotels</button>
      </div>
    );
  }

  // Default position & gallery
  const defaultPosition = [20.5937, 78.9629];
  const position = hotel.location
    ? [hotel.location.lat, hotel.location.lng]
    : defaultPosition;

  const galleryImages = [
    hotel.image,
    hotel.interiorImg1,
    hotel.interiorImg2,
    hotel.interiorImg3
  ].filter(Boolean);

  const nearbySpots = getNearbyAttractions(hotel.cityId);

  // Slider controls
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  // --- INSIDE HOTELSPAGE COMPONENT ---

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // 🟢 Removed misplaced import from here

  const handleHotelBooking = async (selectedHotel) => {
    // 🟢 ENABLE RAZORPAY
    const res = await loadRazorpay();
    if (!res) {
      toast.error("Razorpay SDK failed to load"); // 🔴 Replace alert
      return;
    }

    // ✅ CALCULATE TOTAL FIRST
    const nights = calculateNights(dates.checkIn, dates.checkOut);
    const total = nights * selectedHotel.price;

    const options = {
      key: "rzp_test_1DP5mmOlF5G5ag",
      // ... same options
      handler: async function (response) {
        const paymentId = response.razorpay_payment_id;

        try {
          const userStr = localStorage.getItem("user");
          if (!userStr) {
            toast.error("Please login to book a hotel"); // 🔴 Replace alert
            navigate("/login");
            return;
          }
          const user = JSON.parse(userStr);
          const customerId = user.customer_id || user.Customer_id || user.customerId || user.id;

          const bookDate = dates.checkIn || new Date().toISOString().split('T')[0];
          await api.user.bookHotel(customerId, hotel.id, bookDate);

          // 🟢 NAVIGATE
          toast.success("Hotel booking successful!"); // 🟢 Success Toast
          navigate("/bookingsuccess", { state: { paymentId } });

        } catch (error) {
          console.error("Booking failed", error);
          toast.error("Booking failed! Please try again."); // 🔴 Replace alert
        }
      },
      theme: { color: "#3399cc" }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };




  return (
    <div className="hotel-details-page">

      {/* HERO / SLIDER */}
      <section className="hotel-hero">
        <img
          src={galleryImages[currentSlide]}
          alt={`${hotel.name} view`}
          className="hero-slider-img"
        />

        {galleryImages.length > 1 && (
          <>
            <button onClick={prevSlide} className="slider-btn left" aria-label="Previous image">
              <ChevronLeft size={24} />
            </button>
            <button onClick={nextSlide} className="slider-btn right" aria-label="Next image">
              <ChevronRight size={24} />
            </button>
            <div className="slider-dots">
              {galleryImages.map((_, idx) => (
                <div
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`dot ${idx === currentSlide ? "active" : ""}`}
                  role="button"
                  aria-label={`Go to image ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}

        <div className="hotel-hero-overlay">
          <span className="hotel-badge">{hotel.type}</span>
          <h1 className="hotel-title">{hotel.name}</h1>
          <div className="hotel-location">
            <MapPin size={18} />
            <span>{hotel.cityId.toUpperCase()}</span>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="hotel-content container">

        {/* Left Column */}
        <div className="hotel-left">

          {/* Overview */}
          <div className="hotel-section">
            <h2 className="section-title">Hotel Overview</h2>
            <p className="section-desc">{hotel.desc}</p>
          </div>

          {/* Amenities */}
          <div className="hotel-section amenities-card">
            <h2 className="section-title">Amenities & Services</h2>
            <div className="amenities-grid">
              {hotel.amenities.map((item, idx) => (
                <div className="amenity-item" key={idx}>
                  {item.toLowerCase().includes("wifi") && <Wifi size={18} />}
                  {item.toLowerCase().includes("pool") && <Coffee size={18} />}
                  {item.toLowerCase().includes("spa") && <Shield size={18} />}
                  {!["wifi", "pool", "spa"].some((k) => item.toLowerCase().includes(k)) && <Star size={18} />}
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interior Section */}
          <div className="hotel-section interior-section">
            <h2 className="section-title">
              <ImageIcon size={20} style={{ marginRight: '10px', verticalAlign: 'middle', color: '#ef4444' }} />
              Inside the Hotel
            </h2>
            <div className="interior-grid">
              {hotel.interiorImg1 && (
                <div className="interior-img-wrapper">
                  <img src={hotel.interiorImg1} alt="Hotel Interior 1" className="interior-img" />
                </div>
              )}
              {hotel.interiorImg2 && (
                <div className="interior-img-wrapper">
                  <img src={hotel.interiorImg2} alt="Hotel Interior 2" className="interior-img" />
                </div>
              )}
              {hotel.interiorImg3 && (
                <div className="interior-img-wrapper">
                  <img src={hotel.interiorImg3} alt="Hotel Interior 3" className="interior-img" />
                </div>
              )}
              {!hotel.interiorImg1 && !hotel.interiorImg2 && !hotel.interiorImg3 && (
                <p className="section-desc">Interior images not available for this property.</p>
              )}
            </div>
          </div>

          {/* Map Location */}
          <div className="hotel-section map-section">
            <h2 className="section-title">Location</h2>
            <div className="map-container" style={{ height: "300px", zIndex: 0 }}>
              <MapContainer
                center={position}
                zoom={13}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; OpenStreetMap'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {hotel.location && (
                  <Marker position={position}>
                    <Popup>{hotel.name}</Popup>
                  </Marker>
                )}
              </MapContainer>
            </div>
          </div>

          {/* Nearby */}
          <div className="hotel-section nearby-section">
            <h2 className="section-title">What's Nearby</h2>
            <div className="nearby-grid">
              {nearbySpots.map((spot, idx) => (
                <div key={idx} className="nearby-item">
                  <Navigation size={16} />
                  <span>{spot}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="hotel-section">
            <ReviewSection reviews={reviews} />
          </div>
        </div>

        {/* Right Column - Booking Card */}
        <div className="hotel-right">
          <div className="price-card sticky-card">
            <div className="price-header">
              <p className="price-label">Price starts at</p>
              <div className="price-value">
                <IndianRupee size={24} />
                {hotel.price}
                <span className="per-night"> / night</span>
              </div>
            </div>

            <hr className="divider" />

            <div className="booking-inputs">
              <div className="input-group">
                <label><Calendar size={14} /> Check-in</label>
                <input
                  type="date"
                  className="date-input"
                  value={dates.checkIn}
                  min={new Date().toISOString().split('T')[0]} // ✅ ADDED: Can't select past dates
                  onChange={(e) => setDates({ ...dates, checkIn: e.target.value })}
                />
              </div>
              <div className="input-group">
                <label><Calendar size={14} /> Check-out</label>
                <input
                  type="date"
                  className="date-input"
                  value={dates.checkOut}
                  min={dates.checkIn || new Date().toISOString().split('T')[0]} // ✅ ADDED: Must be after check-in
                  onChange={(e) => setDates({ ...dates, checkOut: e.target.value })}
                />
              </div>
              <div className="input-group">
                <label><Users size={14} /> Guests</label>
                <select
                  className="guest-select"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                >
                  <option>1 Adult</option>
                  <option>2 Adults</option>
                  <option>2 Adults, 1 Child</option>
                  <option>Family (4 Guests)</option>
                </select>
              </div>
            </div>

            {/* ✅ ADDED: Show calculated total */}
            {dates.checkIn && dates.checkOut && (
              <div className="booking-summary">
                <p>
                  {calculateNights(dates.checkIn, dates.checkOut)} night(s) × ₹{hotel.price} =
                  <strong> ₹{calculateNights(dates.checkIn, dates.checkOut) * hotel.price}</strong>
                </p>
              </div>
            )}

            <button
              className="btn-book"
              onClick={() => handleHotelBooking(hotel)}
            >
              Book Your Stay
            </button>

            <div className="booking-guarantee">
              <Shield size={14} />
              <span>Best Price Guaranteed</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HotelsDetails;