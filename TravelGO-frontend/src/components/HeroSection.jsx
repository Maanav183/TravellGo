import React from "react";

const HeroSection = () => {
  const scrollToNext = () => {
    const section = document.getElementById("categories");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full h-[90vh] flex items-center justify-center text-center">
      
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/HomePage/homepage.mp4" type="video/mp4" />
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Hero Content */}
      <div className="relative z-10 px-4">
        <h1 className="text-6xl md:text-8xl font-extrabold text-white tracking-wide">
          TravellGO
        </h1>

        <p className="mt-4 text-lg md:text-2xl text-gray-200">
          Plan Your Next Unforgettable Journey
        </p>

        <button className="mt-8 px-6 py-3 bg-yellow-500 text-black font-semibold rounded-full hover:bg-yellow-400 transition">
          Start Exploring
        </button>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={scrollToNext}
        className="absolute bottom-6 animate-bounce"
      >
        <svg
          className="w-8 h-8 text-yellow-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </section>
  );
};

export default HeroSection;
