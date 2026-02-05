export const destinations = [
  {
    id: "agra",
    name: "Agra",
    tagline: "More than just a monument—it's a walk through history's greatest love story.",
    price: "8,499",
    duration: "2 Nights / 3 Days",
    description: "Experience the epitome of Mughal architecture. From the sunrise at the Taj Mahal to the historic red sandstone walls of Agra Fort, discover a city where every corner whispers stories of timeless love and imperial grandeur.",
    localVibe: "Busy heritage lanes filled with the aroma of Petha and the sight of intricate marble crafts.",
    features: ["Heritage", "Architecture", "History"],
    attractions: [
      { image: "/Destinationdetails/taj mahal.jpg", name: "Taj Mahal", desc: "The ivory-white marble mausoleum on the south bank of the Yamuna river.", lat: 27.175015, lng: 78.042155, embedUrl: "https://www.airpano.com/embed.php?3D=taj-mahal-india&startscene=0&ath=-61.747&atv=5.000&fov=81.00" },
      { image: "/Destinationdetails/agra-fort.jpg", name: "Agra Fort", desc: "A historical fort that was the main residence of the emperors of the Mughal Dynasty.", lat: 27.1795, lng: 78.0211 },
      { image: "/Destinationdetails/Mehtab Bagh.jpg", name: "Mehtab Bagh", desc: "The ultimate 'Street View' spot to see the Taj across the river at sunset.", lat: 27.1767, lng: 78.0395 }
    ],

    included: ["4-Star Hotel", "Breakfast", "Private AC Cab", "Entry Tickets"],
    tips: [
      "Book Taj Mahal tickets online a day in advance to skip the 2-hour queue.",
      "Visit the Taj at sunrise for the best photos and fewer crowds.",
      "Beware of 'guides' who offer suspiciously low prices near the entrance."
    ],
    packages: [
      {
        tier: "Budget",
        title: "Agra Essential Explorer",
        price: "8,499",
        days: 3,
        nights: 2,
        highlights: ["Sunrise Taj Visit", "Agra Fort Tour", "Standard Heritage Stay"]
      },
      {
        tier: "Luxury",
        title: "Mughal Royal Experience",
        price: "16,500",
        days: 4,
        nights: 3,
        highlights: ["Luxury Suite Stay", "Private Historian Guide", "Fine Dining at Oberoi Amarvilas"]
      }
    ],
    itinerary: [
      { day: 1, title: "Arrival & Sunset View", desc: "Check-in and head to Mehtab Bagh for a stunning view." },
      { day: 2, title: "The Seven Wonders", desc: "Guided tour of the Taj Mahal and Agra Fort." },
      { day: 3, title: "Fatehpur Sikri", desc: "Visit the ancient ghost city before departure." }
    ],
    reviews: [
      { user: "Rahul", stars: 5, comment: "Seeing the Taj at sunrise is something I will never forget. 10/10." },
      { user: "Priya", stars: 4, comment: "Agra Fort was amazing, but the city is quite crowded. Guide was great though." }
    ]
  },
  {
    id: "delhi",
    name: "Delhi",
    tagline: "A beautiful mess of old-world soul and high-speed city life.",
    price: "7,999",
    duration: "2 Nights / 3 Days",
    description: "Discover a city that has been destroyed and rebuilt seven times, blending ancient ruins with a pulsing modern heart. From the narrow lanes of Chandni Chowk to the majestic India Gate, Delhi offers a sensory journey like no other.",
    localVibe: "A chaotic masterpiece of rickshaws, metro trains, and world-class street food.",
    features: ["Culture", "Street Food", "Markets"],
    attractions: [
      { image: "/Destinationdetails/Qutub Minar.jpg", name: "Qutub Minar", desc: "The tallest brick minaret in the world and a UNESCO World Heritage Site.", lat: 28.5245, lng: 77.1855 },
      { image: "/Destinationdetails/Chandni Chowk.jpg", name: "Chandni Chowk", desc: "The heart of Old Delhi—perfect for a real street-view experience.", lat: 28.6506, lng: 77.2303 },
      { image: "/Destinationdetails/Lotus Temple.jpg", name: "Lotus Temple", desc: "A Bahá'í House of Worship notable for its flowerlike shape.", lat: 28.5535, lng: 77.2588 }
    ],

    included: ["Heritage Stay", "Metro Pass", "Rickshaw Tour", "Breakfast"],
    tips: [
      "Download the Delhi Metro app; it's the fastest way to beat the city's infamous traffic.",
      "Carry a scarf or stole; most religious sites like Jama Masjid require modest clothing.",
      "Avoid eating cut fruits from street vendors; stick to hot, freshly cooked street food."
    ],
    packages: [
      {
        tier: "Budget",
        title: "Delhi Metro Trails",
        price: "7,999",
        days: 3,
        nights: 2,
        highlights: ["Street Food Crawl", "Old Delhi Rickshaw Ride", "Budget Boutique Stay"]
      },
      {
        tier: "Luxury",
        title: "Imperial Capital Tour",
        price: "19,000",
        days: 4,
        nights: 3,
        highlights: ["Lutyens' Delhi Private Tour", "5-Star Luxury Hotel", "Private Airport Transfers"]
      }
    ],
    itinerary: [
      { day: 1, title: "Old Delhi Charm", desc: "Rickshaw rides through spice markets." },
      { day: 2, title: "Imperial Delhi", desc: "Explore Humayun's Tomb and Qutub Minar." },
      { day: 3, title: "Dilli Haat", desc: "Local shopping and artisan food before heading home." }
    ],
    reviews: [
      { user: "Karan", stars: 5, comment: "The Old Delhi food tour was life-changing! Must try the Paranthas." },
      { user: "Sanya", stars: 5, comment: "Beautifully organized trip, the guide was very helpful with history." }
    ]
  },
  {
    id: "goa",
    name: "Goa",
    tagline: "Swap the schedule for salt air, seafood, and a permanent sunset state of mind.",
    price: "14,500",
    duration: "4 Nights / 5 Days",
    description: "Explore the perfect tropical escape with a Portuguese twist. Beyond the sun-drenched beaches and vibrant shacks, find hidden white-washed churches, spice plantations, and a relaxed 'Susegad' lifestyle that heals the soul.",
    localVibe: "Chill beach shacks, neon-lit night markets, and sleepy Portuguese quarters.",
    features: ["Beach", "Nightlife", "History"],
    attractions: [
      { image: "/Destinationdetails/Baga Beach.jpg", name: "Baga Beach", desc: "The pulse of North Goa, known for nightlife and water sports." },
      { image: "/Destinationdetails/Basilica of Bom Jesus.jpg", name: "Basilica of Bom Jesus", desc: "A stunning example of Jesuit architecture in Old Goa." },
      { image: "/Destinationdetails/Dudhsagar Falls.jpg", name: "Dudhsagar Falls", desc: "A four-tiered waterfall that looks like a sea of milk." }
    ],
    included: ["Beach Resort", "Scooter Rental", "Breakfast", "Airport Pickup"],
    tips: [
      "Rent a scooter for North Goa, but hire a private cab for the winding roads of South Goa.",
      "Carry high-SPF sunscreen; the Goan sun is much stronger than it feels due to the breeze.",
      "Respect the 'No Plastic' rules on beaches to avoid heavy fines from beach patrols."
    ],
    packages: [
      {
        tier: "Budget",
        title: "North Goa Beach Vibes",
        price: "14,500",
        days: 5,
        nights: 4,
        highlights: ["Beach Shack Hop", "Water Sports Combo", "Scooter Rental Included"]
      },
      {
        tier: "Luxury",
        title: "South Goa Private Retreat",
        price: "32,000",
        days: 6,
        nights: 5,
        highlights: ["Private Beach Villa", "Yacht Sunset Cruise", "Personalized Chef Experience"]
      }
    ],
    itinerary: [
      { day: 1, title: "Beach Arrival", desc: "Touchdown and sundowners." },
      { day: 2, title: "North Goa Pulse", desc: "Aguada Fort and flea markets." },
      { day: 3, title: "Old Goa Heritage", desc: "Latin Quarter walks and churches." },
      { day: 4, title: "Island Life", desc: "Ferry ride to Divar Island." }
    ],
    reviews: [
      { user: "Rohan", stars: 5, comment: "Perfect balance of beach parties and peaceful South Goa vibes." },
      { user: "Melissa", stars: 5, comment: "The scuba diving experience was safe and professionally handled." }
    ]
  },
  {
    id: "jaipur",
    name: "Jaipur",
    tagline: "Get lost in a city that wears its royal heritage on every pink-painted street.",
    price: "9,200",
    duration: "3 Nights / 4 Days",
    description: "he Pink City is a feast for the eyes with massive hill forts and intricate palaces. Wander through the Amber Fort, marvel at the Hawa Mahal's facade, and dive into colorful bazaars filled with handcrafted jewelry and textiles.",
    localVibe: "Royal grandeur meets colorful bazaars and folk music at every corner.",
    features: ["Palaces", "Shopping", "Forts"],
    attractions: [
      { image: "/Destinationdetails/Amer Fort.jpg", name: "Amer Fort", desc: "A majestic fort overlooking Maota Lake." },
      { image: "/Destinationdetails/Hawa Mahal.jpg", name: "Hawa Mahal", desc: "The 'Palace of Winds' with its unique honeycomb facade." },
      { image: "/Destinationdetails/City Palace.jpg", name: "City Palace", desc: "A complex of courtyards, gardens, and buildings in the heart of the city." }
    ],
    included: ["Haveli Stay", "Fort Jeep Safari", "Cultural Dinner", "Guide"],
    tips: [
      "Most forts involve significant uphill walking; wear comfortable sneakers rather than sandals.",
      "Bargain politely in Johari Bazaar; quoted prices for textiles are usually 30% higher than actuals.",
      "Visit Nahargarh Fort at sunset for a panoramic view of the entire 'Pink City' lighting up."
    ],
    packages: [
      {
        tier: "Budget",
        title: "Pink City Backpack",
        price: "9,200",
        days: 4,
        nights: 3,
        highlights: ["Fort Hiking Tour", "Local Bazaar Walk", "Haveli Guest House"]
      },
      {
        tier: "Luxury",
        title: "Maharajah's Palace Stay",
        price: "24,500",
        days: 5,
        nights: 4,
        highlights: ["Heritage Palace Suite", "Private Elephant-free Jeep Safari", "Royal Rajasthani Thali Dinner"]
      }
    ],
    itinerary: [
      { day: 1, title: "Pink City Welcome", desc: "Evening visit to Hawa Mahal." },
      { day: 2, title: "Forts & Views", desc: "Full day at Amer and Nahargarh Forts." },
      { day: 3, title: "Bazaars", desc: "Shopping for blue pottery and textiles." }
    ],
    reviews: [
      { user: "Vikram", stars: 5, comment: "The Amber Fort jeep ride was thrilling. Loved the Rajasthani Thali!" },
      { user: "Ananya", stars: 5, comment: "Shopping at Johari Bazaar was the highlight. The palaces are so colorful." }
    ]
  },
  {
    id: "kashmir",
    name: "Kashmir",
    tagline: "Quiet the world and find out why they call this place paradise.",
    price: "18,999",
    duration: "5 Nights / 6 Days",
    description: "Known as 'Heaven on Earth,' Kashmir offers breathtaking landscapes that soothe the soul. Experience a serene shikhara ride on Dal Lake, explore the vibrant Mughal gardens of Srinagar, and witness the snow-capped peaks of Gulmarg that define Himalayan beauty.",
    localVibe: "Serene mountain silence broken only by the sound of Shikara paddles.",
    features: ["Mountain", "Lake", "Garden"],
    attractions: [
      { image: "/Destinationdetails/Dal Lake.jpg", name: "Dal Lake", desc: "Stay in houseboats and shop at the floating vegetable markets." },
      { image: "/Destinationdetails/Gulmarg.jpg", name: "Gulmarg", desc: "Home to one of the world's highest cable cars (Gondola)." },
      { image: "/Destinationdetails/Pahalgam.jpg", name: "Pahalgam", desc: "The 'Valley of Shepherds' known for its lush green meadows." }
    ],
    included: ["Houseboat Stay", "Shikara Ride", "All Meals", "Gondola Tickets"],
    tips: [
      "Only Postpaid SIM cards work in the valley; Prepaid cards from other states will have no network.",
      "Keep your woolens handy even in summer; evenings in Gulmarg and Pahalgam get very chilly.",
      "Always carry some cash; while UPI is growing, remote areas still prefer physical currency."
    ],
    packages: [
      {
        tier: "Budget",
        title: "Paradise on a Budget",
        price: "18,999",
        days: 6,
        nights: 5,
        highlights: ["Shikara Lake Ride", "Gulmarg Day Trip", "Cozy Houseboat Stay"]
      },
      {
        tier: "Luxury",
        title: "The Himalayan Grandeur",
        price: "45,000",
        days: 7,
        nights: 6,
        highlights: ["Premium Boutique Houseboat", "Helicopter Valley Tour", "All-inclusive Mountain Resort"]
      }
    ],
    itinerary: [
      { day: 1, title: "Srinagar Arrival", desc: "Check-in to a Houseboat." },
      { day: 2, title: "Gulmarg", desc: "Gondola ride and snow walks." },
      { day: 3, title: "Pahalgam", desc: "Riverside relaxation and valley tours." }
    ],
    reviews: [
      { user: "Karan", stars: 5, comment: "The Old Delhi food tour was life-changing! Must try the Paranthas." },
      { user: "Arjun", stars: 5, comment: "Beautifully organized trip, the guide was very helpful with history." }
    ]
  },
  {
    id: "manali",
    name: "Manali",
    tagline: "Pine trees, mountain peaks, and that crisp air you’ve been craving.",
    price: "11,000",
    duration: "3 Nights / 4 Days",
    description: "Nestled in the Beas River valley, Manali is a high-altitude Himalayan resort town that serves as a gateway for adventure. From trekking in Solang Valley to the spiritual peace of Hadimba Devi Temple, it's the perfect blend of thrill and tranquility for every traveler.",
    localVibe: "Cozy wood-cabin cafes, riverside campfires, and mountain adventure trails.",
    features: ["Adventure", "Snow", "Trekking"],
    attractions: [
      { image: "/Destinationdetails/Rohtang Pass.jpg", name: "Rohtang Pass", desc: "A high mountain pass offering stunning snowy landscapes." },
      { image: "/Destinationdetails/Hadimba Temple.jpg", name: "Hadimba Temple", desc: "An ancient wooden temple in the middle of a cedar forest." },
      { image: "/Destinationdetails/Old Manali.jpg", name: "Old Manali", desc: "The hub for backpackers, cafes, and local handicrafts." }
    ],
    included: ["Mountain Cottage", "Rohtang Permit", "Breakfast & Dinner", "Driver"],
    tips: [
      "Network issues make digital payments slow in Old Manali; keep enough cash for cafes.",
      "Apply for the Rohtang Pass permit online at least 2 days early if you aren't booking via us.",
      "Check the weather for 'Cloudburst' warnings during July-August before heading to the river."
    ],
    packages: [
      {
        tier: "Budget",
        title: "Himalayan Backpacker",
        price: "11,000",
        days: 4,
        nights: 3,
        highlights: ["Riverside Camping", "Rohtang Pass Tour", "Old Manali Cafe Crawl"]
      },
      {
        tier: "Luxury",
        title: "Alpine Luxury Retreat",
        price: "22,000",
        days: 5,
        nights: 4,
        highlights: ["Luxury Wooden Cottage", "Private Riverside Bonfire", "Paragliding & Adventure Pack"]
      }
    ],
    itinerary: [
      { day: 1, title: "Riverside Chills", desc: "Explore Old Manali cafes." },
      { day: 2, title: "Solang Valley", desc: "Paragliding and snow sports." },
      { day: 3, title: "Vashisht", desc: "Visit hot springs and local temples." }
    ],
    reviews: [
      { user: "Arjun", stars: 4, comment: "Solang Valley paragliding was scary but fun! Very scenic routes." },
      { user: "Sneha", stars: 5, comment: "Old Manali cafes have the best vibe. Perfect for a 4-day getaway." }
    ]
  },
  {
    id: "mumbai",
    name: "Mumbai",
    tagline: "Catch the sea breeze and find your own rhythm in the city that never stops.",
    price: "10,500",
    duration: "2 Nights / 3 Days",
    description: "The city that never sleeps is a magnificent melting pot of cultures, commerce, and colonial history. Walk along the iconic Marine Drive at sunset, visit the historic Gateway of India, and dive into the fast-paced energy of the nation's financial and cinematic powerhouse.",
    localVibe: "Non-stop energy, the sound of local trains, and the calm of the Arabian Sea.",
    features: ["City Life", "Bollywood", "Seafront"],
    attractions: [
      { image: "/Destinationdetails/Marine Drive.jpg", name: "Marine Drive", desc: "The 'Queen's Necklace'—the best spot for a city sunset." },
      { image: "/Destinationdetails/Gateway of India.jpg", name: "Gateway of India", desc: "Mumbai's most iconic landmark overlooking the harbor." },
      { image: "/Destinationdetails/Colaba Causeway.webp", name: "Colaba Causeway", desc: "A bustling street market for fashion and antiques." }
    ],

    included: ["Luxury Stay", "City Transfers", "Guided Walk", "Breakfast"],
    tips: [
      "The Local Train is an experience, but avoid it during 9 AM - 11 AM peak hours.",
      "Carry an umbrella if visiting between June and September—the monsoon is no joke here.",
      "Use metered black-and-yellow taxis for authentic city travel; they are very reliable."
    ],
    packages: [
      {
        tier: "Budget",
        title: "Maximum City Explorer",
        price: "10,500",
        days: 3,
        nights: 2,
        highlights: ["Dharavi Educational Tour", "Marine Drive Walk", "South Bombay Heritage Stay"]
      },
      {
        tier: "Luxury",
        title: "Bollywood & Skyline Glam",
        price: "28,000",
        days: 4,
        nights: 3,
        highlights: ["Taj Mahal Palace Stay", "Private Bollywood Studio Tour", "Luxury Yacht Experience"]
      }
    ],
    itinerary: [
      { day: 1, title: "Gateway & Marine Drive", desc: "Evening stroll by the sea." },
      { day: 2, title: "Elephanta Caves", desc: "Ferry ride to ancient rock-cut temples." },
      { day: 3, title: "South Bombay", desc: "Heritage walk through colonial architecture." }
    ],
    reviews: [
      { user: "Karan", stars: 5, comment: "The Marine Drive sunset is the best feeling in the world. City of dreams!" },
      { user: "Tanvi", stars: 4, comment: "Fast-paced and exciting. Colaba Causeway is great for street shopping." }
    ]
  }
];