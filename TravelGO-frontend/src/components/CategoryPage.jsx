// src/components/CategoryPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CategoryPage = ({ categories, basePath }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // 🔍 Filter categories
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-16">
      
      {/* 🔍 Search */}
      <div className="flex justify-center mb-12">
        <input
          type="text"
          placeholder="Search destinations or adventures"
          className="w-full max-w-lg px-6 py-3 text-gray-800 bg-white border border-gray-300 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* 🗺️ Category Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category) => (
            <div
              key={category.slug}
              onClick={() => navigate(`${basePath}/${category.slug}`)}
              className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-2"
            >
              {/* Image */}
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-56 object-cover"
              />

              {/* Content */}
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-900">
                  {category.name}
                </h3>
                <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                  {category.description}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full text-lg">
            No categories found.
          </p>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
