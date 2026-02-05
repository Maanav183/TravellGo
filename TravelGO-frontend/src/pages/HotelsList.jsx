import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { Search, Star, Coffee, Wifi, Shield, MapPin, Loader2 } from "lucide-react";
import "../style/hotels.css";
import api from '../services/api';
import { toast } from '../components/Toast'; // 🟢 Added Toast
import { useAuth } from '../hooks/useAuth'; // 🟢 Added useAuth

function HotelsList() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [results, setResults] = useState([]);
    const [allHotels, setAllHotels] = useState([]); // Store all fetched hotels
    const [searched, setSearched] = useState(false);
    const [loading, setLoading] = useState(true);

    // 🟢 Helper to get hotel specific image
    const getHotelImage = (name, city) => {
        if (!name) return "/HomePage/hotels.jpeg";
        const n = name.toLowerCase();

        // Specific Hotel Mappings
        if (n.includes("oberoi")) return "/Hotels/Oberoi_agra.jpg";
        if (n.includes("taj") && n.includes("exotica")) return "/Hotels/TajExotica_goa.png";
        if (n.includes("taj")) return "/Hotels/TajResorts_agra.avif";
        if (n.includes("leela")) return "/Hotels/Leela_delhi.png";
        if (n.includes("bloom")) return "/Hotels/Bloomrooms_delhi.jpg";
        if (n.includes("fairfield")) return "/Hotels/Fairfield_goa.jpg";
        if (n.includes("fariyas")) return "/Hotels/Fariyas_mumbai.jpg";
        if (n.includes("heevan")) return "/Hotels/Heevan_kashmir.jpg";
        if (n.includes("itc")) return "/Hotels/ITC_jaipur.jpg";
        if (n.includes("inn")) return "/Hotels/Inn_manali.jpg";
        if (n.includes("khyber")) return "/Hotels/Khyber_kashmir.jpg";
        if (n.includes("marol")) return "/Hotels/Marol_mumbai.png";
        if (n.includes("pearl")) return "/Hotels/Pearl_jaipur.jpg";
        if (n.includes("radisson")) return "/Hotels/Radisson_delhi.jpg";
        if (n.includes("rambagh")) return "/Hotels/Rambagh_jaipur.jpg";
        if (n.includes("roseate")) return "/Hotels/Roseate_delhi.png";
        if (n.includes("sahara")) return "/Hotels/Sahara_mumbai.jpg";
        if (n.includes("snow")) return "/Hotels/Snow_manali.jpg";
        if (n.includes("solang")) return "/Hotels/Solang_manali.jpg";
        if (n.includes("span")) return "/Hotels/Span_manali.jpg";
        if (n.includes("treebo")) return "/Hotels/Treebo_mumbai.jpg";
        if (n.includes("umaid")) return "/Hotels/Umaid_jaipur.jpg";
        if (n.includes("zostel")) return "/Hotels/Zostel_manali.avif";

        // City fallback
        if (city) {
            const c = city.toLowerCase();
            if (c.includes("agra")) return "/images/agra.jpg";
            if (c.includes("delhi")) return "/images/delhi.jpg";
            if (c.includes("goa")) return "/images/goa.jpg";
            if (c.includes("jaipur")) return "/images/jaipur.jpg";
            if (c.includes("kashmir")) return "/images/kashmir.jpg";
            if (c.includes("manali")) return "/images/manali.jpg";
            if (c.includes("mumbai")) return "/images/mumbai.jpg";
        }

        return "/HomePage/hotels.jpeg";
    };

    // Fetch Hotels from Backend
    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const response = await api.user.getHotels();
                // Map backend fields to frontend expected fields
                const mappedHotels = response.data.map(h => ({
                    id: h.hotelId,
                    name: h.hotelName,
                    type: h.hotelType,
                    desc: h.hotelDescription,
                    cityId: h.city, // Backend city
                    price: h.rent,
                    // 🟢 Use dynamic image from DB if valid, else fallback to mapping
                    image: (h.image && h.image.length > 5) ? h.image : getHotelImage(h.hotelName, h.city),
                    rating: h.rating || 4.5,
                    amenities: typeof h.amenities === 'string'
                        ? h.amenities.split(',').map(a => a.trim())
                        : (Array.isArray(h.amenities) ? h.amenities : ["Wifi", "Pool", "Restaurant"])
                }));
                setAllHotels(mappedHotels);
                setResults(mappedHotels);
            } catch (error) {
                console.error("Failed to fetch hotels", error);
                toast.error("Failed to load hotels. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchHotels();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate search delay for better UX
        setTimeout(() => {
            const query = searchQuery.toLowerCase().trim();

            if (!query) {
                // If empty search, show all hotels
                setResults(allHotels);
                setSearched(false);
                setLoading(false);
                return;
            }

            // Search in ALL fetched hotels
            const filteredHotels = allHotels.filter(hotel =>
                (hotel.cityId && hotel.cityId.toLowerCase().includes(query)) ||
                (hotel.name && hotel.name.toLowerCase().includes(query)) ||
                (hotel.type && hotel.type.toLowerCase().includes(query))
            );

            setResults(filteredHotels);
            setSearched(true);
            setLoading(false);
        }, 300);
    };

    // Better amenity icon mapping
    const getAmenityIcon = (amenity) => {
        const amenityLower = amenity.toLowerCase();

        if (amenityLower.includes("wifi") || amenityLower.includes("internet")) {
            return <Wifi size={14} />;
        }
        if (amenityLower.includes("pool") || amenityLower.includes("swimming")) {
            return <Coffee size={14} />;
        }
        if (amenityLower.includes("spa") || amenityLower.includes("massage")) {
            return <Shield size={14} />;
        }
        if (amenityLower.includes("gym") || amenityLower.includes("fitness")) {
            return <Shield size={14} />;
        }
        if (amenityLower.includes("restaurant") || amenityLower.includes("dining")) {
            return <Coffee size={14} />;
        }
        return <Star size={14} />;
    };

    // Clear search function
    const handleClearSearch = () => {
        setSearchQuery("");
        setResults(allHotels);
        setSearched(false);
    };

    return (
        <div className="hotels-page">
            <div className="hotels-hero">
                <h1 className="hotel-page-title">
                    Find Your perfect <span className="highlight-text">Stay</span>
                </h1>
                <form onSubmit={handleSearch} className="search-bar-wrapper">
                    <Search className="search-icon" size={20} />
                    <input
                        type="text"
                        placeholder="Search by city, hotel name, or type (e.g. Mumbai, Luxury)"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? "Searching..." : "Search"}
                    </button>
                    {/* Clear button */}
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={handleClearSearch}
                            className="clear-btn"
                            style={{
                                position: 'absolute',
                                right: '120px',
                                background: 'transparent',
                                border: 'none',
                                color: '#64748b',
                                cursor: 'pointer',
                                fontSize: '0.9rem'
                            }}
                        >
                            Clear
                        </button>
                    )}
                </form>

                {/* Search results count */}
                {searched && (
                    <p style={{
                        textAlign: 'center',
                        marginTop: '1rem',
                        color: '#64748b',
                        fontSize: '0.9rem'
                    }}>
                        Found {results.length} hotel{results.length !== 1 ? 's' : ''} for "{searchQuery}"
                    </p>
                )}
            </div>

            <div className="results-container">
                {/* Loading state */}
                {loading ? (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '300px',
                        gap: '1rem'
                    }}>
                        <Loader2 className="animate-spin" size={48} color="#ef4444" />
                        <p style={{ color: '#64748b' }}>Searching hotels...</p>
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        {results.length > 0 ? (
                            <motion.div
                                className="hotels-grid"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                {results.map((hotel) => (
                                    <motion.div
                                        key={hotel.id}
                                        className="hotel-card"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                        whileHover={{ y: -5, transition: { duration: 0.2 } }} // Hover effect
                                    >
                                        {/* Badge */}
                                        <div className="hotel-badge">{hotel.type}</div>

                                        <div
                                            className="hotel-img"
                                            style={{ backgroundImage: `url(${hotel.image})` }}
                                        />

                                        <div className="hotel-details">
                                            <h3>{hotel.name}</h3>

                                            {/* City location */}
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                color: '#64748b',
                                                fontSize: '0.85rem',
                                                marginBottom: '8px'
                                            }}>
                                                <MapPin size={12} />
                                                <span>{hotel.cityId ? hotel.cityId.toUpperCase() : "UNKNOWN"}</span>
                                            </div>

                                            <div className="hotel-meta">
                                                <span className="rating">
                                                    <Star size={14} fill="#facc15" stroke="none" />
                                                    <span style={{ marginLeft: '4px' }}>{hotel.rating || "4.5"}</span>
                                                </span>
                                                <span className="price">
                                                    ₹{hotel.price}
                                                    <span style={{
                                                        fontSize: '0.8rem',
                                                        fontWeight: 400,
                                                        color: '#94a3b8'
                                                    }}>/night</span>
                                                </span>
                                            </div>

                                            <p className="hotel-desc">
                                                {hotel.desc.length > 100
                                                    ? `${hotel.desc.substring(0, 100)}...`
                                                    : hotel.desc}
                                            </p>

                                            <div className="amenity-icons">
                                                {hotel.amenities?.slice(0, 3).map((amenity, idx) => (
                                                    <span key={idx} className="amenity-tag">
                                                        {getAmenityIcon(amenity)}
                                                        {amenity}
                                                    </span>
                                                ))}
                                            </div>

                                            <button onClick={() => navigate(`/hotels/${hotel.id}`)} className="view-btn">
                                                View Details
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : searched && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="no-results"
                            >
                                <p>No hotels found for "<strong>{searchQuery}</strong>".</p>
                                <p style={{
                                    fontSize: '0.9rem',
                                    marginTop: '0.5rem',
                                    color: '#64748b'
                                }}>
                                    Try searching for "Mumbai", "Jaipur", "Manali", or "Luxury".
                                </p>
                                <button
                                    onClick={handleClearSearch}
                                    style={{
                                        marginTop: '1rem',
                                        padding: '0.5rem 1.5rem',
                                        background: '#ef4444',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Show All Hotels
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
}

export default HotelsList;