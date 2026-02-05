import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // 🟢 Added AnimatePresence
import { Search, MapPin } from 'lucide-react';
import { destinations } from '../data/destinations';
import DestinationCard from '../components/DestinationCard';
import "../style/DestinationsPage.css";

// 🟢 Animation variants for the grid items
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1 // Each card will appear 0.1s after the previous one
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

function DestinationsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBudget, setSelectedBudget] = useState('all');

  const filteredDestinations = useMemo(() => {
    return destinations.filter((dest) => {
      const matchesSearch = dest.name.toLowerCase().includes(searchTerm.toLowerCase());
      const priceNum = parseInt(dest.price.replace(/,/g, ''));
      const matchesBudget = selectedBudget === 'all' ||
        (selectedBudget === 'budget' && priceNum < 10000) ||
        (selectedBudget === 'premium' && priceNum >= 10000);

      return matchesSearch && matchesBudget;
    });
  }, [searchTerm, selectedBudget]);

  return (
    <div className="destinations-page-bg">
      <div className="max-w-7xl mx-auto px-6 py-16">
        
        {/* 🟢 Animated Header Section */}
     <header className="mb-16 text-center">
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
  >
    <h1 className="dest-page-title">
      Find Your Next <span className="highlight-text">Adventure</span>
    </h1>
    <p className="dest-page-subtitle">Discover handpicked destinations for your perfect getaway</p>
  </motion.div>

          {/* 🟢 Animated Filter Pod */}
          <motion.div 
            className="filter-container"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="search-input-wrapper">
              <Search className="search-icon-fixed" size={20} />
              <input
                type="text"
                placeholder="Where to next? (e.g. Goa, Manali)"
                className="dest-search-input"
                onChange={(e) => setSearchTerm(e.target.value)} />
            </div>

            <div className="select-wrapper">
              <MapPin className="select-icon" size={18} />
              <select
                className="dest-budget-select"
                onChange={(e) => setSelectedBudget(e.target.value)}
              >
                <option value="all">All Budgets</option>
                <option value="budget">Value (Under ₹10k)</option>
                <option value="premium">Premium (₹10k+)</option>
              </select>
            </div>
          </motion.div>
        </header>

        {/* 🟢 Animated Staggered Grid */}
        <motion.div 
          className="destinations-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          key={searchTerm + selectedBudget} // Re-triggers animation when filters change
        >
          <AnimatePresence mode='popLayout'>
            {filteredDestinations.length > 0 ? (
              filteredDestinations.map(city => (
                <motion.div 
                  key={city.id} 
                  variants={itemVariants}
                  layout // Smoothly repositions cards when others are filtered out
                >
                  <DestinationCard destination={city} />
                </motion.div>
              ))
            ) : (
              <motion.div 
                className="no-results-box"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p>No destinations match your search. Try another vibe!</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

export default DestinationsPage;