package com.Travellgo.config;

import com.Travellgo.entity.Bus;
import com.Travellgo.entity.Hotel;
import com.Travellgo.entity.Packages;
import com.Travellgo.repository.BusRepo;
import com.Travellgo.repository.HotelRepo;
import com.Travellgo.repository.PackageRepo;
import com.Travellgo.repository.RouteRepo;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate; // Added import for LocalDate
import java.util.List;

import com.Travellgo.entity.Customer; // Added
import com.Travellgo.repository.CustomerRepo; // Added
import org.springframework.security.crypto.password.PasswordEncoder; // Added
import java.util.Optional; // Added

@Configuration
public class DataInitializer {

        @Bean
        CommandLineRunner initData(HotelRepo hotelRepo, BusRepo busRepo, PackageRepo packageRepo, RouteRepo routeRepo,
                        CustomerRepo customerRepo, PasswordEncoder passwordEncoder) {
                return args -> {
                        // --- SEED ADMIN ---
                        if (customerRepo.findByEmail("admin@travelgo.com").isEmpty()) {
                                Customer admin = new Customer();
                                admin.setName("Super Admin");
                                admin.setEmail("admin@travelgo.com");
                                admin.setPassword(passwordEncoder.encode("admin123"));
                                admin.setRole("ROLE_ADMIN");
                                admin.setPhoneNo("9999999999");
                                admin.setAddress("Headquarters, TravelGO");
                                customerRepo.save(admin);
                                System.out.println("Seeded Admin User: admin@travelgo.com / admin123");
                        }

                        // --- SEED CATALOGUE DATA (Hotels, Packages, Buses) ---
                        // Check if any major catalogue is empty to trigger full re-seed
                        if (hotelRepo.count() == 0 || busRepo.count() == 0 || routeRepo.count() == 0
                                        || packageRepo.count() == 0) {
                                System.out.println("⚠️ Catalogue data incomplete. Triggering FULL RE-SEED...");

                                // Clean up existing to ensure fresh start
                                routeRepo.deleteAll();
                                busRepo.deleteAll(); // Delete buses after routes (integrity)
                                hotelRepo.deleteAll();
                                packageRepo.deleteAll();

                                // 1. Seed Hotels
                                List<Hotel> hotels = List.of(
                                                // AGRA
                                                createHotel("The Oberoi Amarvilas", "Luxury", "agra", 35000, 4.9,
                                                                "/Hotels/Oberoi_agra.jpg",
                                                                "Taj View, Butler Service, Pool",
                                                                "The Oberoi Amarvilas Agra is a premier 5-star hotel 600 meters from the Taj Mahal.",
                                                                "/Hotels/img5.jpg", "/Hotels/img3.jpg",
                                                                "/Hotels/img33.jpg", "Available"),
                                                createHotel("Hotel Taj Resorts", "Budget", "agra", 3200, 4.1,
                                                                "/Hotels/TajResorts_agra.avif",
                                                                "Rooftop Pool, Walking Tours",
                                                                "Hotel Taj Resorts in Agra is a boutique property located near the Eastern Gate of the Taj Mahal.",
                                                                "/Hotels/img15.jpg", "/Hotels/img33.jpg",
                                                                "/Hotels/img19.jpg", "Available"),
                                                // DELHI
                                                createHotel("The Leela Palace", "Luxury", "delhi", 22000, 4.8,
                                                                "/Hotels/Leela_delhi.png",
                                                                "Rooftop Pool, Luxury Spa, Fine Dining",
                                                                "Architectural masterpiece in the heart of Diplomatic Enclave.",
                                                                "/Hotels/img5.jpg", "/Hotels/img13.jpg",
                                                                "/Hotels/img33.jpg", "Available"),
                                                createHotel("Bloomrooms @ Link Road", "Budget", "delhi", 4500, 4.2,
                                                                "/Hotels/Bloomrooms_delhi.jpg",
                                                                "Cafe, Free Wifi, iMac Stations",
                                                                "Bright, clean, and cheerful budget stay near the metro.",
                                                                "/Hotels/img42.jpg", "/Hotels/img45.jpg",
                                                                "/Hotels/img47.jpg", "Available"),
                                                createHotel("Radisson Blu Marina", "Services", "delhi", 9800, 4.3,
                                                                "/Hotels/Radisson_delhi.jpg",
                                                                "Business Center, Gym, Lounge",
                                                                "Boutique-style service in the vibrant Connaught Place.",
                                                                "/Hotels/img23.jpg", "/Hotels/img32.jpg",
                                                                "/Hotels/img46.jpg", "Available"),
                                                createHotel("Roseate House", "Luxury", "delhi", 15500, 4.6,
                                                                "/Hotels/Roseate_delhi.png",
                                                                "Cinema, Rooftop Pool, Spa",
                                                                "Ultra-modern luxury hotel located in Aerocity.",
                                                                "/Hotels/img2.jpg", "/Hotels/img12.jpg",
                                                                "/Hotels/img31.jpg", "Available"),
                                                // GOA
                                                createHotel("Taj Exotica Resort", "Luxury", "goa", 28000, 4.7,
                                                                "/Hotels/TajExotica_goa.png",
                                                                "Private Beach, Golf Course, Spa",
                                                                "Taj Exotica Resorts are premier luxury properties known for exceptional service.",
                                                                "/Hotels/img14.jpg", "/Hotels/img7.jpg",
                                                                "/Hotels/img27.jpg", "Available"),
                                                createHotel("Fairfield by Marriott", "Services", "goa", 7200, 4.2,
                                                                "/Hotels/Fairfield_goa.png",
                                                                "Pool, Buffet Breakfast, Gym",
                                                                "Fairfield by Marriott is a prominent midscale, limited-service hotel brand.",
                                                                "/Hotels/img12.jpg", "/Hotels/img35.jpg",
                                                                "/Hotels/img33.jpg", "Available"),
                                                // JAIPUR
                                                createHotel("Rambagh Palace", "Luxury", "jaipur", 45000, 4.9,
                                                                "/Hotels/Rambagh_jaipur.jpg",
                                                                "Heritage Walk, Royal Spa, Fine Dining",
                                                                "Rambagh Palace in Jaipur, known as the 'Jewel of Jaipur', is a luxurious heritage hotel.",
                                                                "/Hotels/img12.jpg", "/Hotels/img35.jpg",
                                                                "/Hotels/img47.jpg", "Available"),
                                                createHotel("Pearl Palace Heritage", "Budget", "jaipur", 3500, 4.6,
                                                                "/Hotels/Pearl_jaipur.jpg",
                                                                "Artistic Decor, Rooftop Cafe",
                                                                "Award-winning boutique guesthouse with unique themed rooms.",
                                                                "/Hotels/img38.jpg", "/Hotels/img37.jpg",
                                                                "/Hotels/img42.jpg", "Available"),
                                                createHotel("ITC Rajputana", "Services", "jaipur", 12000, 4.5,
                                                                "/Hotels/ITC_jaipur.jpg",
                                                                "Pool, Traditional Dining, Bar",
                                                                "ITC Rajputana, a Luxury Collection Hotel in Jaipur.",
                                                                "/Hotels/img35.jpg", "/Hotels/img25.jpg",
                                                                "/Hotels/img13.jpg", "Available"),
                                                createHotel("Umaid Bhawan Hotel", "Services", "jaipur", 5500, 4.2,
                                                                "/Hotels/Umaid_jaipur.jpg",
                                                                "Pool, Folk Dance, Garden",
                                                                "Heritage style hotel with traditional Rajput architecture.",
                                                                "/Hotels/img16.jpg", "/Hotels/img11.jpg",
                                                                "/Hotels/img33.jpg", "Available"),
                                                // KASHMIR
                                                createHotel("The Khyber Himalayan Resort", "Luxury", "kashmir", 32000,
                                                                4.8, "/Hotels/Khyber_kashmir.jpg",
                                                                "Heated Pool, Skiing, Cinema",
                                                                "World-class luxury in Gulmarg with views of the Affarwat peaks.",
                                                                "/Hotels/img42.jpg", "/Hotels/img41.jpg",
                                                                "/Hotels/img43.jpg", "Available"),
                                                createHotel("Hotel Heevan", "Services", "kashmir", 8500, 4.0,
                                                                "/Hotels/Heevan_kashmir.jpg",
                                                                "River View, Garden, Parking",
                                                                "Quaint hotel located on the banks of the Lidder River in Pahalgam.",
                                                                "/Hotels/img43.jpg", "/Hotels/img34.jpg",
                                                                "/Hotels/img38.jpg", "Available"),
                                                // MANALI
                                                createHotel("Span Resort and Spa", "Luxury", "manali", 18000, 4.6,
                                                                "/Hotels/Span_manali.jpg",
                                                                "Riverfront, Gym, Private Balcony",
                                                                "Classic luxury stay on the banks of the Beas River.",
                                                                "/Hotels/img29.jpg", "/Hotels/img36.jpg",
                                                                "/Hotels/img22.jpg", "Available"),
                                                createHotel("Zostel Manali", "Budget", "manali", 1200, 4.4,
                                                                "/Hotels/Zostel_manali.avif",
                                                                "Backpacker Vibe, Common Area, Wifi",
                                                                "The perfect hub for young travelers and adventure seekers.",
                                                                "/Hotels/img17.jpg", "/Hotels/img36.jpg",
                                                                "/Hotels/img26.jpg", "Available"),
                                                createHotel("The Manali Inn", "Services", "manali", 5800, 4.1,
                                                                "/Hotels/Inn_manali.jpg",
                                                                "Mountain View, Disco, Spa",
                                                                "Comfortable rooms with excellent hospitality and valley views.",
                                                                "/Hotels/img14.jpg", "/Hotels/img9.jpg",
                                                                "/Hotels/img21.jpg", "Available"),
                                                createHotel("Snow Valley Resorts", "Services", "manali", 4200, 4.3,
                                                                "/Hotels/Snow_manali.jpg",
                                                                "Orchard View, Cafe, Games Room",
                                                                "Surrounded by pine forests and apple orchards with great vistas.",
                                                                "/Hotels/img16.jpg", "/Hotels/img4.jpg",
                                                                "/Hotels/img18.jpg", "Available"),
                                                createHotel("Solang Valley Resort", "Luxury", "manali", 14000, 4.5,
                                                                "/Hotels/Solang_manali.jpg",
                                                                "Adventure Sports, River View, Fireplace",
                                                                "Located right in the heart of the action in Solang Valley.",
                                                                "/Hotels/img25.jpg", "/Hotels/img8.jpg",
                                                                "/Hotels/img33.jpg", "Available"),
                                                // MUMBAI
                                                createHotel("Hotel Sahara Star", "Luxury", "mumbai", 11290, 4.3,
                                                                "/Hotels/Sahara_mumbai.jpg",
                                                                "Spa, Pool, Cinema",
                                                                "Lavish airport hotel with 5 restaurants and a wine cellar.",
                                                                "/Hotels/img10.jpg", "/Hotels/img2.jpg",
                                                                "/Hotels/img40.jpg", "Available"),
                                                createHotel("Treebo Premium Widlor", "Budget", "mumbai", 4336, 4.3,
                                                                "/Hotels/Treebo_mumbai.jpg",
                                                                "Rooftop Cafe, Pool",
                                                                "Laid-back budget hotel offering a rooftop cafe and pool.",
                                                                "/Hotels/img7.jpg", "/Hotels/img31.jpg",
                                                                "/Hotels/img28.jpg", "Available"),
                                                createHotel("Fariyas Hotel", "Services", "mumbai", 8988, 4.0,
                                                                "/Hotels/Fariyas_mumbai.jpg",
                                                                "Free Wi-Fi, 2 Restaurants",
                                                                "Relaxed rooms in a straightforward property with great service.",
                                                                "/Hotels/img5.jpg", "/Hotels/img23.jpg",
                                                                "/Hotels/img13.jpg", "Available"),
                                                createHotel("Hotel Marol Metro", "Budget", "mumbai", 2077, 3.1,
                                                                "/Hotels/Marol_mumbai.png",
                                                                "Transit Access, AC",
                                                                "Convenient and affordable stay near the metro line.",
                                                                "/Hotels/img15.jpg", "/Hotels/img35.jpg",
                                                                "/Hotels/img42.jpg", "Available"));
                                hotelRepo.saveAll(hotels);
                                System.out.println("✅ Re-seeded Hotels");

                                // 2. Seed Buses & Routes
                                seedBusAndRoute(busRepo, routeRepo, "Royal Travels", "AC Sleeper", 32, 1200, "09:00 PM",
                                                "02:00 PM", "Delhi", "Kashmir", 4.5,
                                                "/buses/Heritage-Express-ac-sleeper.jpg");
                                seedBusAndRoute(busRepo, routeRepo, "Heritage Express", "Luxury Semi-Sleeper", 15, 850,
                                                "07:00 PM", "07:00 AM", "Delhi", "Jaipur", 4.7,
                                                "/buses/Heritage-Express-semi-sleeper-bus.jpg");
                                seedBusAndRoute(busRepo, routeRepo, "Sahara Bus", "Non-AC Seater", 50, 500, "11:00 PM",
                                                "12:00 AM", "Kashmir", "Manali", 4.8, "/buses/Sahara-Bus.webp");
                                seedBusAndRoute(busRepo, routeRepo, "Royal Travels", "AC Sleeper (2+1)", 32, 1200,
                                                "10:30 PM", "06:00 AM", "Mumbai", "Goa", 4.5,
                                                "/buses/Royal-Travels-bus-4.jpg");
                                seedBusAndRoute(busRepo, routeRepo, "Sahara Travels", "Non-AC Seater", 15, 450,
                                                "07:30 AM", "11:00 AM", "Agra", "Delhi", 3.8,
                                                "/buses/sahara-travels-bus-5.jpg");
                                seedBusAndRoute(busRepo, routeRepo, "Heritage Express", "Luxury Volvo Multi-Axle", 24,
                                                950, "11:00 PM", "06:00 AM", "Mumbai", "Manali", 5.0,
                                                "/buses/Heritage-Express-bus-6.webp");
                                seedBusAndRoute(busRepo, routeRepo, "Skyline Travels", "Scania AC Sleeper", 18, 1400,
                                                "08:30 PM", "08:00 AM", "Mumbai", "Agra", 4.9,
                                                "/buses/skyline-travels-bus-7.avif");
                                System.out.println("✅ Re-seeded Buses & Routes");

                                // 3. Seed Packages
                                List<Packages> packages = List.of(
                                                createPackage("Mughal Heritage Tour", "Heritage", 8500, "agra", "2D/1N",
                                                                "Sunrise Taj Mahal View, Agra Fort Guided Tour", 4.5,
                                                                "Agra"),
                                                createPackage("Imperial Luxury Stay", "Premium", 24000, "agra", "3D/2N",
                                                                "5-Star Hotel with Taj View, Private Sunset Dinner",
                                                                4.8, "Agra"),
                                                createPackage("Agra Day Explorer", "Budget", 4500, "agra", "1 Day",
                                                                "Skip-the-line Entry, Local Street Food Trail", 4.2,
                                                                "Agra"),
                                                // DELHI
                                                createPackage("Capital Explorer", "Budget", 7500, "delhi", "3D/2N",
                                                                "Old Delhi Rickshaw Ride, Red Fort & Qutub Minar", 4.3,
                                                                "Delhi"),
                                                createPackage("The Lutyens' Luxury", "Premium", 28000, "delhi", "3D/2N",
                                                                "Heritage Hotel Stay, Private Museum Tour", 4.9,
                                                                "Delhi"),
                                                // GOA
                                                createPackage("Coastal Explorer", "Budget", 12500, "goa", "4D/3N",
                                                                "North Goa Beach Hopping, Scooter Rental Included", 4.4,
                                                                "Goa"),
                                                createPackage("Elite Sands Retreat", "Premium", 45000, "goa", "5D/4N",
                                                                "Private Beach Villa, Yacht Sunset Cruise", 4.8, "Goa"),
                                                createPackage("Old Goa Heritage", "Heritage", 18000, "goa", "3D/2N",
                                                                "Portuguese Villa Stay, Basilica Guided Tour", 4.6,
                                                                "Goa"),
                                                // JAIPUR
                                                createPackage("Royal Rajputana", "Heritage", 16500, "jaipur", "3D/2N",
                                                                "Amer Fort Jeep Safari, City Palace Access", 4.9,
                                                                "Jaipur"),
                                                createPackage("Pink City Budget", "Budget", 6500, "jaipur", "2D/1N",
                                                                "Hawa Mahal Viewpoint, Johari Bazaar Shopping", 4.2,
                                                                "Jaipur"),
                                                // KASHMIR
                                                createPackage("Paradise on Dal", "Heritage", 22000, "kashmir", "4D/3N",
                                                                "Luxury Houseboat Stay, Shikara Ride at Sunset", 4.9,
                                                                "Kashmir"),
                                                createPackage("Gulmarg Snow Adventure", "Adventure", 19500, "kashmir",
                                                                "3D/2N", "Gondola Ride Phase 2, Skiing Lessons", 4.7,
                                                                "Kashmir"),
                                                // MANALI
                                                createPackage("Backpacker's Snow Trail", "Budget", 9000, "manali",
                                                                "4D/3N", "Cozy Riverside Hostel, Local Trekking Guide",
                                                                4.5, "Manali"),
                                                createPackage("Himalayan Luxury Escape", "Premium", 32000, "manali",
                                                                "5D/4N",
                                                                "Luxury Glass Igloo Stay, Helicopter Snow Tour", 4.8,
                                                                "Manali"),
                                                // MUMBAI
                                                createPackage("Maximum City Explorer", "Heritage", 9500, "mumbai",
                                                                "3D/2N", "Marine Drive Walk, Gateway of India", 4.4,
                                                                "Mumbai"),
                                                createPackage("Bollywood & Skyline Glam", "Premium", 28000, "mumbai",
                                                                "4D/3N", "Private Studio Tour, Luxury Yacht Experience",
                                                                4.7, "Mumbai"));
                                packageRepo.saveAll(packages);
                                System.out.println("✅ Re-seeded Packages");
                        }
                };
        }

        private void seedBusAndRoute(BusRepo busRepo, com.Travellgo.repository.RouteRepo routeRepo, String agency,
                        String type, int capacity, double fare, String dep, String arr, String from, String to,
                        double rating,
                        String image) {
                Bus b = new Bus();
                b.setTravelAgency(agency);
                b.setBusType(type);
                b.setCapacity(capacity);
                b.setFare(fare);
                b.setDepartureTime(dep);
                b.setArrivalTime(arr);
                b.setRoute(from + " - " + to);
                b.setRating(rating);
                b.setImage(image);

                b = busRepo.save(b);

                com.Travellgo.entity.Route r = new com.Travellgo.entity.Route();
                r.setRouteFrom(from);
                r.setRouteTo(to);
                r.setTiming(dep + " - " + arr);
                r.setDateOfJourney(java.time.LocalDate.now().plusDays(1));
                r.setBus_id(b.getBusId());

                r = routeRepo.save(r);

                b.setRouteId(r.getRouteId());
                busRepo.save(b);
        }

        private Hotel createHotel(String name, String type, String city, double rent, double rating, String image,
                        String amenities, String desc, String img1, String img2, String img3, String status) {
                Hotel h = new Hotel();
                h.setHotelName(name);
                h.setHotelType(type);
                h.setCity(city);
                h.setRent(rent);
                h.setRating(rating);
                h.setImage(image);
                h.setAmenities(amenities);
                h.setHotelDescription(desc);
                h.setInteriorImg1(img1);
                h.setInteriorImg2(img2);
                h.setInteriorImg3(img3);
                h.setStatus(status);
                h.setHotelAddress("Near City Center"); // Default
                return h;
        }

        private Packages createPackage(String name, String type, double cost, String city, String duration,
                        String highlights, double rating, String cityNameForImage) {
                Packages p = new Packages();
                p.setPackageName(name);
                p.setPackageType(type);
                p.setCost(cost);
                p.setCity(city);
                p.setDuration(duration);
                p.setHighlights(highlights);
                p.setRating(rating);
                p.setPackageDescription(highlights); // Use highlights as desc for now
                return p;
        }
}
