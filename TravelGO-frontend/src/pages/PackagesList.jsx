import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api'; // Import API
import { Check, Star, Clock, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import "../style/PackagesList.css";

const PackageList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const cityRefs = useRef({});
  const targetId = location.state?.targetCityId;

  const [packagesData, setPackagesData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fallback images for known cities
  const cityImages = {
    "agra": "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=600&auto=format&fit=crop",
    "jaipur": "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=600&auto=format&fit=crop",
    "delhi": "/images/delhi.jpg",
    "new delhi": "/images/delhi.jpg",
    "mumbai": "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?q=80&w=600&auto=format&fit=crop",
    "goa": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=600&auto=format&fit=crop",
    "kerala": "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=600&auto=format&fit=crop",
    "manali": "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=600&auto=format&fit=crop",
    "udaipur": "https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?q=80&w=600&auto=format&fit=crop",
    "kashmir": "https://images.unsplash.com/photo-1598091383021-15ddea10925d?q=80&w=600&auto=format&fit=crop",
    "srinagar": "https://images.unsplash.com/photo-1598091383021-15ddea10925d?q=80&w=600&auto=format&fit=crop",
    "jammu and kashmir": "https://images.unsplash.com/photo-1598091383021-15ddea10925d?q=80&w=600&auto=format&fit=crop",
    "ladakh": "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80&w=600&auto=format&fit=crop",
    "leh": "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80&w=600&auto=format&fit=crop",
    "bengaluru": "https://images.unsplash.com/photo-1596176530529-181a53271a71?q=80&w=600&auto=format&fit=crop",
    "bangalore": "https://images.unsplash.com/photo-1596176530529-181a53271a71?q=80&w=600&auto=format&fit=crop",
    "chennai": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=600&auto=format&fit=crop",
    "hyderabad": "https://images.unsplash.com/photo-1572445217366-27bc8929e7c7?q=80&w=600&auto=format&fit=crop",
    "kolkata": "https://images.unsplash.com/photo-1558431382-27e30314225d?q=80&w=600&auto=format&fit=crop",
    "rishikesh": "https://images.unsplash.com/photo-1589820296156-2454bb8a6d54?q=80&w=600&auto=format&fit=crop",
    "varanasi": "https://images.unsplash.com/photo-1561361513-35e67f84053b?q=80&w=600&auto=format&fit=crop",
    "default": "/HomePage/Destinations.png"
  };

  const getCityImage = (cityName, packageImage) => {
    const key = cityName?.trim().toLowerCase();
    // Prioritize static image if available
    if (cityImages[key]) return cityImages[key];

    // Fallback to package image if available and valid
    if (packageImage && (packageImage.startsWith("http") || packageImage.startsWith("/"))) return packageImage;

    return cityImages["default"];
  };

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await api.user.getPackages();
        // Transform backend data to frontend structure
        let mappedPlans = response.data.map(pkg => ({
          id: pkg.packageId,
          title: pkg.packageName,
          category: pkg.packageType,
          duration: pkg.duration || "3 Days / 2 Nights",
          price: pkg.cost,
          city: pkg.city, // Now available from backend
          image: pkg.image, // Preserve image for city thumbnail
          highlights: [pkg.packageDescription], // Use desc as highlight
          description: pkg.packageDescription,
          recommended: false
        }));

        const searchParams = new URLSearchParams(location.search);
        const searchQuery = searchParams.get('search');

        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          mappedPlans = mappedPlans.filter(p =>
            p.title.toLowerCase().includes(query) ||
            (p.city && p.city.toLowerCase().includes(query)) ||
            (p.category && p.category.toLowerCase().includes(query)) ||
            (p.description && p.description.toLowerCase().includes(query))
          );

          // If searching, keep a flat list but still structure it as a group
          setPackagesData([{
            cityId: "search-results",
            cityName: `Search Results: "${searchQuery}"`,
            description: `${mappedPlans.length} packages found`,
            plans: mappedPlans
          }]);
        } else {
          // GROUP BY CITY
          const grouped = mappedPlans.reduce((acc, plan) => {
            const city = plan.city || "Other Destinations";
            if (!acc[city]) {
              acc[city] = {
                cityId: city.replace(/\s+/g, '-').toLowerCase(),
                cityName: city.charAt(0).toUpperCase() + city.slice(1).toLowerCase(),
                description: `Explore the best packages in ${city}`,
                image: getCityImage(city, plan.image),
                plans: []
              };
            }
            acc[city].plans.push(plan);
            return acc;
          }, {});

          setPackagesData(Object.values(grouped));
        }
      } catch (error) {
        console.error("Failed to fetch packages", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [location.search]);

  const handleGoBack = () => {
    navigate('/destinations');
  };

  const handleSelectPlan = (city, plan) => {
    navigate(`/package-details/${plan.id}`, {
      state: { city, plan }
    });
  };

  useEffect(() => {
    if (targetId && cityRefs.current[targetId]) {
      cityRefs.current[targetId].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [targetId, packagesData]);

  if (loading) return (
    <div className="loader-container">
      <Loader2 className="animate-spin text-maroon" size={48} />
      <p>Loading Packages...</p>
    </div>
  );

  return (
    <div className="packages-section-root">
      <div className="packages-grid">
        <button className="back-to-dest-btn" onClick={handleGoBack}>
          <ArrowLeft size={18} /> Back to Destinations
        </button>
        {packagesData.map((city) => (
          <div
            key={city.cityId}
            ref={el => cityRefs.current[city.cityId] = el}
            className={`destination-package-row ${targetId === city.cityId ? 'highlight-glow' : ''}`}
          >
            <div className="package-dest-info">
              <div className="image-container">
                <img
                  src={city.image || "/HomePage/Destinations.png"}
                  alt={city.cityName}
                  onError={(e) => { e.target.src = "/HomePage/Destinations.png"; }}
                />
                <div className="dest-badge">{city.plans?.length || 0} Packages</div>
              </div>
              <h2 className="dest-section-title" style={{ textTransform: 'capitalize' }}>{city.cityName}</h2>
              <p className="dest-description-text">{city.description}</p>
            </div>

            <div className="package-plans-wrapper">
              {city.plans?.map((plan) => (
                <div
                  key={plan.id}
                  className={`package-card ${plan.recommended ? 'recommended-border' : ''}`}
                  style={{ overflow: 'hidden' }}
                >
                  {/* Package Image at Top - ADDED THIS BLOCK */}


                  {plan.recommended && (
                    <div className="popular-badge">
                      <Star size={12} fill="currentColor" /> TRAVELGO PICK
                    </div>
                  )}

                  <div className="card-header" style={{ padding: '15px 15px 0 15px' }}>
                    <span className="plan-category">{plan.category}</span>
                    <div className="plan-duration">
                      <Clock size={14} /> {plan.duration}
                    </div>
                  </div>

                  <h4 style={{ padding: '0 15px' }}>{plan.title}</h4>

                  <ul className="package-features" style={{ padding: '0 15px' }}>
                    {plan.highlights.map((highlight, index) => (
                      <li key={index}>
                        <Check size={14} className="check-icon" /> {highlight}
                      </li>
                    ))}
                  </ul>

                  <div className="package-footer" style={{ padding: '15px' }}>
                    <div className="price-box">
                      <span className="price-label">Starting at</span>
                      <span className="package-price">₹{plan.price}</span>
                    </div>
                    <button className="select-plan-btn" onClick={() => handleSelectPlan(city, plan)}>
                      Select Plan <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PackageList;