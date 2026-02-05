import React, { useState, useEffect } from 'react';
import { Sun, Cloud, CloudRain, Wind, Thermometer } from 'lucide-react';

const WeatherWidget = () => {
  const cities = ["Agra", "Delhi", "Goa", "Jaipur", "Kashmir", "Manali", "Mumbai"];
  const [currentCityIndex, setCurrentCityIndex] = useState(0);

  // Mock weather data (In a real app, you'd fetch this from OpenWeatherAPI)
  const weatherData = {
    "Agra": { temp: 22, condition: "Sunny", icon: <Sun className="text-yellow-400" /> },
    "Delhi": { temp: 18, condition: "Hazy", icon: <Wind className="text-slate-400" /> },
    "Goa": { temp: 30, condition: "Tropical", icon: <Sun className="text-orange-400" /> },
    "Jaipur": { temp: 25, condition: "Clear", icon: <Sun className="text-yellow-500" /> },
    "Kashmir": { temp: 4, condition: "Snowy", icon: <Cloud className="text-blue-200" /> },
    "Manali": { temp: 8, condition: "Chilly", icon: <CloudRain className="text-blue-400" /> },
    "Mumbai": { temp: 28, condition: "Humid", icon: <Cloud className="text-slate-300" /> },
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentCityIndex((prev) => (prev + 1) % cities.length);
    }, 4000); // Change city every 4 seconds
    return () => clearInterval(timer);
  }, []);

  const currentCity = cities[currentCityIndex];
  const data = weatherData[currentCity];

  return (
    <div className="bg-white/80 backdrop-blur-md border border-slate-200 p-6 rounded-3xl shadow-xl max-w-sm mx-auto flex items-center justify-between transition-all duration-500 animate-in fade-in zoom-in">
      <div className="flex flex-col">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-1">Live Update</span>
        <h3 className="text-2xl font-black text-slate-800">{currentCity}</h3>
        <p className="text-slate-500 font-medium">{data.condition}</p>
      </div>
      
      <div className="flex flex-col items-center">
        <div className="mb-2 scale-125">
          {data.icon}
        </div>
        <div className="flex items-center gap-1">
          <Thermometer size={14} className="text-slate-400" />
          <span className="text-2xl font-black text-slate-900">{data.temp}°C</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;