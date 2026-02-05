const buses = [
  { 
    id: "bus-1", 
    agency: "Royal Travels", 
    type: "AC Sleeper", 
    departure: "09:00 PM",
    arrival: "02:00 PM",
    price: 1200, 
    seatsAvailable: 32, 
     rating: 4.5,
    // route: "Delhi - Kshmir",
    image: "/buses/Heritage-Express-ac-sleeper.jpg"
  },
  { 
    id: "bus-2", 
    agency: "Heritage Express", 
    type: "Luxury Semi-Sleeper", 
    departure: "07:00 PM",
    arrival: "07:00 AM",
    price: 850, 
    seatsAvailable: 15, 
     rating: 4.7,
    // route: "Delhi - Jaipur",
    image: "/buses/Heritage-Express-semi-sleeper-bus.jpg" 
  },
  { 
    id: "bus-3", 
    agency: "Sahara Bus", 
    type: "Non-AC Seater", 
    departure: "11:00 PM",
    arrival: "12:00 AM",
    price: 500, 
    seatsAvailable: 50, 
     rating: 4.8,
    // route: "Kashmir - Manali",
    image: "/buses/Sahara-Bus.webp"
  },

  {
    id: "bus-4" ,
    name: "Royal Travels",
    type: "AC Sleeper (2+1)",
    departure: "10:30 PM",
    arrival: "06:00 AM",
    price: 1200,
    seatsAvailable: 32,
    rating: 4.5,
    // route: "Mumbai - Goa",
    image: "/buses/Royal-Travels-bus-4.jpg"
  },
  {
    id: "bus-5",
    name: "Sahara Travels",
    type: "Non-AC Seater",
    departure: "07:30 AM",
    arrival: "11:00 AM",
    price: 450,
    seatsAvailable: 15,
    rating: 3.8,
    // route: "Agra - Delhi",
    image: "/buses/sahara-travels-bus-5.jpg"
  },
  {
    id: "bus-6",
    name: "Heritage Express",
    type: "Luxury Volvo Multi-Axle",
    departure: "11:00 PM",
    arrival: "06:00 AM",
    price: 950,
    seatsAvailable: 24,
    rating: 5.0,
    // route: "Mumbai - Manali",
    image: "/buses/Heritage-Express-bus-6.webp"
  },
  {
    id: "bus-7",
    name: "Skyline Travels",
    type: "Scania AC Sleeper",
    departure: "08:30 PM",
    arrival: "08:00 AM",
    price: 1400,
    seatsAvailable: 18,
    rating: 4.9,
    // route: "Mumbai - Agra",
    image: "/buses/skyline-travels-bus-7.avif"
  }
];

export default buses; 