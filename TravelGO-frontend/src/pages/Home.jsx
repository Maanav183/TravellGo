import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../style/Home.css";

const Home = () => {
  const [showCategories, setShowCategories] = useState(false);
  const categoryRef = useRef(null);
  const navigate = useNavigate();

  const categories = [
    {
      name: "Destinations",
      img: "/HomePage/Destinations.png",
      path: "/destinations",
      description: "Handpicked places for unforgettable journeys"
    },
    {
      name: "Hotels",
      img: "/HomePage/hotels.jpeg",
      path: "/hotels",
      description: "Comfortable stays for every budget"
    },
    {
      name: "Packages",
      img: "/HomePage/Packages.png",
      path: "/packageslist",
      description: "Thrilling experiences beyond the tourist trail"
    },
    
    {
      name: "Buses",
      img: "/HomePage/buses.png",
      path: "/buses",
      description: "Seamless intercity travel across heritage routes"
    },
  ];

  const handleExploreClick = () => {
    setShowCategories(true);
    setTimeout(() => {
      categoryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen w-full flex items-center justify-center text-center overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay loop muted playsInline
        >
          <source src="/HomePage/homepage.mp4" type="video/mp4" />
        </video>
        
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        
        <motion.div
          className="relative p-6 z-10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <h1 className="text-5xl md:text-6xl font-black text-yellow-400 drop-shadow-2xl mb-4">
            Explore Heritage, Discover Culture
          </h1>
          <p className="text-xl md:text-2xl text-yellow-200 font-medium mb-8">
            Get personalized recommendations based on your interests.
          </p>
          <motion.button
  className="relative px-12 py-5 bg-yellow-500 text-black text-2xl font-black rounded-2xl shadow-[0_0_20px_rgba(250,204,21,0.4)] overflow-hidden group"
  onClick={handleExploreClick}
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  initial={{ y: 20, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ delay: 0.5 }}
>
  {/* 🟢 Animated Glow Effect */}
  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
  
  <span className="relative z-10 flex items-center gap-3">
    Start Your Adventure
  </span>
</motion.button>
        </motion.div>
      </section>

      {/* Explore Section */}
      {showCategories && (
        <section ref={categoryRef} className="py-24 bg-[#fdfdfb]">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-sm font-bold tracking-[0.4em] text-yellow-600 uppercase mb-4">
                Curated Journeys
              </h2>
              <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight">
                Explore By Category
              </h2>
            </div>
            
          <div 
  style={{ 
    display: 'grid', 
    // 🟢 FIX 1: Set to a 4-column grid for desktop to shrink individual card width
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
    gap: '20px' 
  }} 
  className="category-grid-container"
>
  {categories.map((item, index) => (
    <motion.div
      key={index}
      // 🟢 FIX 2: Reduced height from 480px to 380px for a more compact look
      className="relative h-[380px] cursor-pointer group"
      whileHover={{ y: -10 }}
      onClick={() => navigate(item.path)}
    >
      <div className="relative w-full h-full rounded-[2rem] overflow-hidden shadow-md bg-white border-[4px] border-white transition-all duration-500 group-hover:shadow-xl">
        <img
          src={item.img}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-90" />
        
        {/* 🟢 FIX 3: Reduced padding from 10 to 6 for the text area */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-left">
          <h3 className="text-2xl font-black text-white mb-2 tracking-tight">
            {item.name}
          </h3>
          
          <div className="w-0 h-1 bg-yellow-500 transition-all duration-500 group-hover:w-12 rounded-full" />
          
          <p className="text-white/0 h-0 group-hover:h-auto group-hover:text-white/90 text-xs mt-3 font-medium transition-all duration-500 leading-relaxed overflow-hidden">
            {item.description}
          </p>
        </div>
      </div>
    </motion.div>
  ))}
</div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;