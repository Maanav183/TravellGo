export const cityPackages = [
  {
    cityId: "agra",
    cityName: "Agra",
    description: "The epitome of Mughal architecture and timeless love.",
    plans: [
      {
        id: "agra-1",
        title: "Mughal Heritage Tour",
        price: "8,500",
        duration: "2D/1N",
        busId: "bus-2", 
        hotelId: "hotel-2",
        highlights: ["Sunrise Taj Mahal View", "Agra Fort Guided Tour", "Boutique Heritage Stay"],
        category: "Heritage"
      },
      {
        id: "agra-2",
        title: "Imperial Luxury Stay",
        price: "24,000",
        duration: "3D/2N",
        busId: "bus-6", 
        hotelId: "hotel-1",
        highlights: ["5-Star Hotel with Taj View", "Private Sunset Dinner", "Luxury Chauffeur Service"],
        category: "Premium",
        recommended: true
      },
      {
        id: "agra-3",
        title: "Agra Day Explorer",
        price: "4,500",
        duration: "1 Day",
        busId: "bus-5", 
         hotelId: "hotel-5",
        highlights: ["Skip-the-line Entry", "Local Street Food Trail", "Artisan Workshop Visit"],
        category: "Budget"
      }
    ]
  },
  {
    cityId: "delhi",
    cityName: "Delhi",
    description: "A vibrant blend of historic ruins and modern city life.",
    plans: [
      {
        id: "delhi-1",
        title: "Capital Explorer",
        price: "7,500",
        duration: "3D/2N",
        busId: "bus-4", 
        hotelId: ["hotel-4","hotel-5"],
        highlights: ["Old Delhi Rickshaw Ride", "Red Fort & Qutub Minar", "Connaught Place Walk"],
        category: "Budget"
      },
      {
        id: "delhi-2",
        title: "The Lutyens' Luxury",
        price: "28,000",
        duration: "3D/2N",
        busId: "bus-1", 
        hotelId: ["hotel-6","hotel-6","hotel-3"],
        highlights: ["Heritage Hotel Stay", "Private Museum Tour", "Fine Dining at Khan Market"],
        category: "Premium",
        recommended: true
      }
    ]
  },
  {
    cityId: "goa",
    cityName: "Goa",
    description: "Sun, sand, and the perfect tropical escape.",
    plans: [
      {
        id: "goa-1",
        title: "Coastal Explorer",
        price: "12,500",
        duration: "4D/3N",
        busId: "bus-1", 
        hotelId: "hotel-5",
        highlights: ["North Goa Beach Hopping", "Scooter Rental Included", "Beachside Shack Stay"],
        category: "Budget"
      },
      {
        id: "goa-2",
        title: "Elite Sands Retreat",
        price: "45,000",
        duration: "5D/4N",
        busId: "bus-6", 
        hotelId: "hotel-7",
        highlights: ["Private Beach Villa", "Yacht Sunset Cruise", "Premium Seafood Dining"],
        category: "Premium",
        recommended: true
      },
      {
        id: "goa-3",
        title: "Old Goa Heritage",
        price: "18,000",
        duration: "3D/2N",
        busId: "bus-1", 
        hotelId: ["hotel-7","hotel-8"],     
           highlights: ["Portuguese Villa Stay", "Basilica Guided Tour", "Feni Tasting Experience"],
        category: "Heritage"
      },
      {
        id: "goa-4",
        title: "Adventure Island",
        price: "15,000",
        duration: "3D/2N",
        busId: "bus-7", 
        hotelId: "hotel-8",
        highlights: ["Scuba Diving Session", "Island Camping", "Water Sports Package"],
        category: "Adventure"
      }
    ]
  },
  {
    cityId: "jaipur",
    cityName: "Jaipur",
    description: "The Pink City, home to royal palaces and vibrant bazaars.",
    plans: [
      {
        id: "jaipur-1",
        title: "Royal Rajputana",
        price: "16,500",
        duration: "3D/2N",
        busId: "bus-1", 
        hotelId: ["hotel-9","hotel-10","hotel-11","hotel-12"],
        highlights: ["Amer Fort Jeep Safari", "City Palace Access", "Traditional Haveli Stay"],
        category: "Heritage",
        recommended: true
      },
      {
        id: "jaipur-2",
        title: "Pink City Budget",
        price: "6,500",
        duration: "2D/1N",
        busId: "bus-1", 
        hotelId: "hotel-5",
        highlights: ["Hawa Mahal Viewpoint", "Johari Bazaar Shopping", "Local Hostel Stay"],
        category: "Budget"
      }
    ]
  },
  {
    cityId: "kashmir",
    cityName: "Kashmir",
    description: "Heaven on earth, where tranquil lakes meet snow-capped peaks.",
    plans: [
      {
        id: "kashmir-1",
        title: "Paradise on Dal",
        price: "22,000",
        duration: "4D/3N",
        busId: "bus-2", 
        hotelId: ["hotel-13","hotel-14"],
        highlights: ["Luxury Houseboat Stay", "Shikara Ride at Sunset", "Mughal Garden Tour"],
        category: "Heritage",
        recommended: true
      },
      {
        id: "kashmir-2",
        title: "Gulmarg Snow Adventure",
        price: "19,500",
        duration: "3D/2N",
        busId: "bus-7", 
        hotelId: "hotel-14",
        highlights: ["Gondola Ride Phase 2", "Skiing Lessons", "Alpine Hut Stay"],
        category: "Adventure"
      }
    ]
  },
  {
    cityId: "manali",
    cityName: "Manali",
    description: "Snow-capped peaks and adrenaline-pumping adventures.",
    plans: [
      {
        id: "manali-1",
        title: "Backpacker's Snow Trail",
        price: "9,000",
        duration: "4D/3N",
        busId: "bus-2", 
        hotelId: ["hotel-16","hotel-18","hotel-17"],
        highlights: ["Cozy Riverside Hostel", "Local Trekking Guide", "Bonfire Nights"],
        category: "Budget"
      },
      {
        id: "manali-2",
        title: "Himalayan Luxury Escape",
        price: "32,000",
        duration: "5D/4N",
        busId: "bus-6", 
        hotelId: ["hotel-19","hotel-15"],
        highlights: ["Luxury Glass Igloo Stay", "Helicopter Snow Tour", "Private Spa Sessions"],
        category: "Premium",
        recommended: true
      },
      {
        id: "manali-3",
        title: "Rohtang Adventure",
        price: "14,500",
        duration: "3D/2N",
        busId: "bus-4", 
        hotelId: ["hotel-17","hotel-18"],
        highlights: ["Rohtang Pass Permit", "Skiing Lessons", "Solang Valley Paragliding"],
        category: "Adventure"
      }
    ]
  },
  {
    cityId: "mumbai",
    cityName: "Mumbai",
    description: "The City of Dreams, where glamour meets heritage.",
    plans: [
      {
        id: "mumbai-1",
        title: "Maximum City Explorer",
        price: "9,500",
        duration: "3D/2N",
        busId: "bus-3", 
        hotelId: ["hotel-21","hotel-22","hotel-23"],
        highlights: ["Marine Drive Walk", "Gateway of India", "Dharavi Educational Tour"],
        category: "Heritage"
      },
      {
        id: "mumbai-2",
        title: "Bollywood & Skyline Glam",
        price: "28,000",
        duration: "4D/3N",
        busId: "bus-6", 
        hotelId: ["hotel-20","hotel-22"],
        highlights: ["Private Studio Tour", "Luxury Yacht Experience", "Taj Mahal Palace Visit"],
        category: "Premium",
        recommended: true
      }
    ]
  }
];

export default cityPackages;