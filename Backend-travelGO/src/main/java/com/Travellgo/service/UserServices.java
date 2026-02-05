package com.Travellgo.service;

import java.time.LocalDate;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.Travellgo.entity.*;
import com.Travellgo.repository.*;
import com.Travellgo.exception.CustomException;
import com.Travellgo.constant.ErrorConstant;

@Service
@Transactional
public class UserServices {

	private static final Logger log = LoggerFactory.getLogger(UserServices.class);

	@Autowired
	private BookingRepo bookingRepo;
	@Autowired
	private BusRepo busRepo;
	@Autowired
	private CustomerRepo customerRepo;
	@Autowired
	private FeedbackRepo feedbackRepo; // Kept if you need it later
	@Autowired
	private HotelRepo hotelRepo;
	@Autowired
	private PackageRepo packageRepo;
	@Autowired
	private RouteRepo routeRepo;
	@Autowired
	private TicketRepo ticketRepo;

	@Autowired
	private PasswordEncoder passwordEncoder;

	// ----------------------------------------------------------------
	// AUTHENTICATION
	// ----------------------------------------------------------------

	public Customer userSignup(Customer customer) {
		log.info("userSignup initiated for email={}", customer.getEmail());
		if (customerRepo.findByEmail(customer.getEmail()).isPresent()) {
			throw new CustomException(ErrorConstant.DUPLICATE_USER, HttpStatus.CONFLICT);
		}
		customer.setPassword(passwordEncoder.encode(customer.getPassword()));
		customer.setRole("ROLE_USER");
		Customer saved = customerRepo.save(customer);
		log.info("userSignup successful for email={}", customer.getEmail());
		return saved;
	}

	public Customer userLogin(String email, String password) {
		log.info("userLogin attempt email={}", email);
		Customer customer = customerRepo.findByEmail(email)
				.orElseThrow(() -> new CustomException(ErrorConstant.INVALID_USER, HttpStatus.UNAUTHORIZED));

		if (!passwordEncoder.matches(password, customer.getPassword())) {
			throw new CustomException(ErrorConstant.BAD_CREDENTIALS, HttpStatus.UNAUTHORIZED);
		}
		log.info("userLogin success email={}", email);
		return customer;
	}

	// ----------------------------------------------------------------
	// UPDATE METHODS
	// ----------------------------------------------------------------

	public Customer updateUser(int customerId, Customer updatedData) {
		log.info("updateUser customerId={}", customerId);
		Customer customer = customerRepo.findById(customerId)
				.orElseThrow(() -> new CustomException(ErrorConstant.INVALID_USER, HttpStatus.NOT_FOUND));

		// Update fields if provided
		if (updatedData.getName() != null && !updatedData.getName().isEmpty()) {
			customer.setName(updatedData.getName());
		}
		if (updatedData.getPhoneNo() != null && !updatedData.getPhoneNo().isEmpty()) {
			customer.setPhoneNo(updatedData.getPhoneNo());
		}
		if (updatedData.getAddress() != null && !updatedData.getAddress().isEmpty()) {
			customer.setAddress(updatedData.getAddress());
		}
		// Add more fields here if needed (e.g. email, but usually email is
		// unique/fixed)

		return customerRepo.save(customer);
	}

	// ----------------------------------------------------------------
	// VIEW METHODS (READ)
	// ----------------------------------------------------------------

	public List<Packages> viewAllPackages() {
		log.debug("viewAllPackages called");
		return packageRepo.findAll();
	}

	public List<Hotel> viewAllHotels() {
		log.debug("viewAllHotels called");
		return hotelRepo.findAll();
	}

	public List<Bus> viewAllBus() {
		log.debug("viewAllBus called");
		return busRepo.findAll();
	}

	public List<Ticket> viewYourTickets(int customerId) {
		log.debug("viewYourTickets customerId={}", customerId);
		Customer customer = customerRepo.findById(customerId)
				.orElseThrow(() -> new CustomException(ErrorConstant.INVALID_USER, HttpStatus.NOT_FOUND));
		return customer.getTickets();
	}

	public List<Booking> viewYourBookings(int customerId) {
		log.debug("viewYourBookings customerId={}", customerId);
		Customer customer = customerRepo.findById(customerId)
				.orElseThrow(() -> new CustomException(ErrorConstant.INVALID_USER, HttpStatus.NOT_FOUND));
		return customer.getBookings();
	}

	public List<Feedback> viewYourReviews(int customerId) {
		log.debug("viewYourReviews customerId={}", customerId);
		Customer customer = customerRepo.findById(customerId)
				.orElseThrow(() -> new CustomException(ErrorConstant.INVALID_USER, HttpStatus.NOT_FOUND));
		return feedbackRepo.findByCustomer(customer);
	}

	// ----------------------------------------------------------------
	// BOOKING LOGIC (WRITE)
	// ----------------------------------------------------------------

	public Booking bookHotel(int customerId, int hotelId, String date) {
		log.info("bookHotel customerId={}, hotelId={}, date={}", customerId, hotelId, date);
		Customer customer = customerRepo.findById(customerId)
				.orElseThrow(() -> new CustomException(ErrorConstant.INVALID_USER, HttpStatus.NOT_FOUND));

		Hotel hotel = hotelRepo.findById(hotelId)
				.orElseThrow(() -> new CustomException(ErrorConstant.HOTEL_NOT_FOUND, HttpStatus.NOT_FOUND));

		Booking booking = new Booking();
		booking.setBookingDate(LocalDate.now());
		booking.setTravelDate(LocalDate.parse(date)); // ✅ Set Travel Date
		booking.setBookingTitle("Hotel Booking");
		booking.setDescription(hotel.getHotelName() + " is booked. Address: " + hotel.getHotelAddress());
		booking.setCustomer(customer);

		// Managing bidirectional relationships
		booking.getHotels().add(hotel);
		hotel.setBooking(booking);
		customer.getBookings().add(booking);

		Booking saved = bookingRepo.save(booking);
		log.info("bookHotel saved customerId={}, hotelId={}", customerId, hotelId);
		return saved;
	}

	public Booking bookPackage(int customerId, int packageId, String date) {
		log.info("bookPackage customerId={}, packageId={}, date={}", customerId, packageId, date);
		Customer customer = customerRepo.findById(customerId)
				.orElseThrow(() -> new CustomException(ErrorConstant.INVALID_USER, HttpStatus.NOT_FOUND));

		Packages pack = packageRepo.findById(packageId)
				.orElseThrow(() -> new CustomException(ErrorConstant.PACKAGE_NOT_FOUND, HttpStatus.NOT_FOUND));

		Booking booking = new Booking();
		booking.setBookingDate(LocalDate.now());
		booking.setTravelDate(LocalDate.parse(date)); // ✅ Set Travel Date
		booking.setBookingTitle("Package Booking");
		booking.setDescription(pack.getPackageName() + " booked. " + pack.getPackageDescription());
		booking.setCustomer(customer);

		booking.getPackages().add(pack);
		pack.setBooking(booking);
		customer.getBookings().add(booking);

		Booking saved = bookingRepo.save(booking);
		log.info("bookPackage saved customerId={}, packageId={}", customerId, packageId);
		return saved;
	}

	public List<String> getBookedSeats(int routeId) {
		Route route = routeRepo.findById(routeId)
				.orElseThrow(() -> new CustomException(ErrorConstant.ROUTE_NOT_FOUND, HttpStatus.NOT_FOUND));

		List<Ticket> tickets = ticketRepo.findByRoute(route);
		return tickets.stream().map(Ticket::getSeatNumber).toList();
	}

	public Ticket bookBus(int customerId, int routeId, int busId, String seatNumber) {
		log.info("bookBus customerId={}, routeId={}, busId={}, seat={}", customerId, routeId, busId, seatNumber);
		Customer customer = customerRepo.findById(customerId)
				.orElseThrow(() -> new CustomException(ErrorConstant.INVALID_USER, HttpStatus.NOT_FOUND));

		Bus bus = busRepo.findById(busId)
				.orElseThrow(() -> new CustomException(ErrorConstant.BUS_NOT_FOUND, HttpStatus.NOT_FOUND));

		Route route = routeRepo.findById(routeId)
				.orElseThrow(() -> new CustomException(ErrorConstant.ROUTE_NOT_FOUND, HttpStatus.NOT_FOUND));

		// Check if seat is already booked
		List<Ticket> existing = ticketRepo.findByRoute(route);
		boolean isBooked = existing.stream().anyMatch(t -> seatNumber.equals(t.getSeatNumber()));
		if (isBooked) {
			throw new CustomException("Seat " + seatNumber + " is already booked", HttpStatus.CONFLICT);
		}

		// Update Route
		route.setBus_id(busId);
		routeRepo.save(route);

		// Create Ticket
		Ticket ticket = new Ticket();
		ticket.setRoute(route);
		ticket.setCustomer(customer);
		ticket.setStatus("Booked");
		ticket.setBus(bus);
		ticket.setSeatNumber(seatNumber);

		customer.getTickets().add(ticket);

		Ticket saved = ticketRepo.save(ticket);
		log.info("bookBus saved customerId={}, routeId={}, busId={}, seat={}", customerId, routeId, busId, seatNumber);
		return saved;
	}

	// ----------------------------------------------------------------
	// CANCELLATION LOGIC
	// ----------------------------------------------------------------

	public void cancelHotelBooking(int bookingId) {
		log.info("cancelHotelBooking bookingId={}", bookingId);
		Booking booking = bookingRepo.findById(bookingId)
				.orElseThrow(() -> new CustomException(ErrorConstant.BOOKING_NOT_FOUND, HttpStatus.NOT_FOUND));

		// Clear associations
		booking.getHotels().forEach(h -> h.setBooking(null));
		booking.getHotels().clear();

		bookingRepo.delete(booking);
		log.info("cancelHotelBooking completed bookingId={}", bookingId);
	}

	public void cancelPackageBooking(int bookingId) {
		log.info("cancelPackageBooking bookingId={}", bookingId);
		Booking booking = bookingRepo.findById(bookingId)
				.orElseThrow(() -> new CustomException(ErrorConstant.BOOKING_NOT_FOUND, HttpStatus.NOT_FOUND));

		booking.getPackages().forEach(p -> p.setBooking(null));
		booking.getPackages().clear();

		bookingRepo.delete(booking);
		log.info("cancelPackageBooking completed bookingId={}", bookingId);
	}

	public void cancelTicket(int ticketId) {
		log.info("cancelTicket ticketId={}", ticketId);
		Ticket ticket = ticketRepo.findById(ticketId)
				.orElseThrow(() -> new CustomException(ErrorConstant.TICKET_NOT_FOUND, HttpStatus.NOT_FOUND));
		// Clean up relationships
		if (ticket.getCustomer() != null) {
			ticket.getCustomer().getTickets().remove(ticket);
		}
		ticket.setCustomer(null);
		ticket.setBus(null);
		ticket.setRoute(null);

		ticketRepo.deleteById(ticketId);
		log.info("cancelTicket completed ticketId={}", ticketId);
	}

	// ----------------------------------------------------------------
	// UTILITY & SEARCH
	// ----------------------------------------------------------------

	public Route route(Route route) {
		// You might want validation here, e.g. check if route already exists
		log.debug("route save called");
		return routeRepo.save(route);
	}

	public List<Hotel> searchFunction(String name) {
		// Ensure your Repo has findHotelsByNameContaining
		log.debug("searchFunction hotels name contains={}", name);
		return hotelRepo.findHotelsByNameContaining(name);
	}

	public List<Bus> searchBus(String name) {
		// Ensure your Repo has findBusesByNameContaining
		log.debug("searchBus buses name contains={}", name);
		return busRepo.findBusesByNameContaining(name);
	}
}