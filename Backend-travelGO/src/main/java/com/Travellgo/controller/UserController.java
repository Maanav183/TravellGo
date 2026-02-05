package com.Travellgo.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.Travellgo.entity.*;
import com.Travellgo.service.UserServices;
import com.Travellgo.exception.CustomException; // Import your exception
import com.Travellgo.constant.ErrorConstant;

@RestController
@CrossOrigin(origins = "*")
public class UserController {

    private static final Logger log = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserServices userServices;

    // User SignUp
    @PostMapping("/userSignUp")
    public ResponseEntity<Customer> customerSignUp(@RequestBody Customer customer) throws CustomException {
        log.info("POST /userSignUp");
        return new ResponseEntity<>(userServices.userSignup(customer), HttpStatus.CREATED);
    }

    // User Login
    @PostMapping("/userLogin")
    public ResponseEntity<Customer> customerLogin(@RequestParam String username, @RequestParam String password)
            throws CustomException {
        log.info("POST /userLogin username={}", username);
        Customer cust = userServices.userLogin(username, password);
        if (cust == null) {
            throw new CustomException(ErrorConstant.INVALID_USER, HttpStatus.UNAUTHORIZED);
        }
        return ResponseEntity.ok(cust);
    }

    // Update User Profile
    @PutMapping("/updateUser/{customerId}")
    public ResponseEntity<Customer> updateUser(@PathVariable int customerId, @RequestBody Customer customer) {
        log.info("PUT /updateUser/{}", customerId);
        return ResponseEntity.ok(userServices.updateUser(customerId, customer));
    }

    // View All Packages
    @GetMapping("/Packages")
    public ResponseEntity<List<Packages>> viewAllPackages() {
        log.info("GET /Packages");
        return ResponseEntity.ok(userServices.viewAllPackages());
    }

    // View All Hotels
    @GetMapping("/Hotels")
    public ResponseEntity<List<Hotel>> viewAllHotels() {
        log.info("GET /Hotels");
        return ResponseEntity.ok(userServices.viewAllHotels());
    }

    // View All Buses
    @GetMapping("/Buses")
    public ResponseEntity<List<Bus>> viewAllBuses() {
        log.info("GET /Buses");
        return ResponseEntity.ok(userServices.viewAllBus());
    }

    // View Your Tickets
    @GetMapping("/YourTicket/{customerId}")
    public ResponseEntity<List<Ticket>> viewYourTicket(@PathVariable int customerId) throws CustomException {
        log.info("GET /YourTicket/{}", customerId);
        return ResponseEntity.ok(userServices.viewYourTickets(customerId));
    }

    // View Your Bookings
    @GetMapping("/YourBookings/{customerId}")
    public ResponseEntity<List<Booking>> viewYourBooking(@PathVariable int customerId) throws CustomException {
        log.info("GET /YourBookings/{}", customerId);
        return ResponseEntity.ok(userServices.viewYourBookings(customerId));
    }

    // View Your Reviews
    @GetMapping("/YourReviews/{customerId}")
    public ResponseEntity<List<Feedback>> viewYourReviews(@PathVariable int customerId) throws CustomException {
        log.info("GET /YourReviews/{}", customerId);
        return ResponseEntity.ok(userServices.viewYourReviews(customerId));
    }

    // Hotel Booking
    @PostMapping("/bookHotel/{customerId}/{hotelId}")
    public ResponseEntity<Booking> booking(@PathVariable int customerId, @PathVariable int hotelId,
            @RequestParam String date)
            throws CustomException {
        log.info("POST /bookHotel/{}/{} date={}", customerId, hotelId, date);
        return new ResponseEntity<>(userServices.bookHotel(customerId, hotelId, date), HttpStatus.CREATED);
    }

    // Package Booking
    @PostMapping("/bookPackage/{customerId}/{packageId}")
    public ResponseEntity<Booking> bookingPackage(@PathVariable int customerId, @PathVariable int packageId,
            @RequestParam String date)
            throws CustomException {
        log.info("POST /bookPackage/{}/{} date={}", customerId, packageId, date);
        return new ResponseEntity<>(userServices.bookPackage(customerId, packageId, date), HttpStatus.CREATED);
    }

    // Bus Booking
    @PostMapping("/bookBus/{customerId}/{routeId}/{busId}")
    public ResponseEntity<Ticket> busBooking(@PathVariable int customerId, @PathVariable int routeId,
            @PathVariable int busId, @RequestParam String seatNumber) throws CustomException {
        log.info("POST /bookBus/{}/{}/{} seat={}", customerId, routeId, busId, seatNumber);
        return new ResponseEntity<>(userServices.bookBus(customerId, routeId, busId, seatNumber), HttpStatus.CREATED);
    }

    // Get Booked Seats
    @GetMapping("/bookedSeats/{routeId}")
    public ResponseEntity<List<String>> getBookedSeats(@PathVariable int routeId) {
        log.info("GET /bookedSeats/{}", routeId);
        return ResponseEntity.ok(userServices.getBookedSeats(routeId));
    }

    // Delete Hotel Booking
    @DeleteMapping("/DeleteHotelBooking/{bookingID}")
    public ResponseEntity<String> deleteHotelBooking(@PathVariable int bookingID) throws CustomException {
        log.info("DELETE /DeleteHotelBooking/{}", bookingID);
        userServices.cancelHotelBooking(bookingID);
        return new ResponseEntity<>("Booking Deleted", HttpStatus.OK);
    }

    // Delete Package Booking
    @DeleteMapping("/DeletePackageBooking/{bookingID}")
    public ResponseEntity<String> deletePackageBooking(@PathVariable int bookingID) throws CustomException {
        log.info("DELETE /DeletePackageBooking/{}", bookingID);
        userServices.cancelPackageBooking(bookingID);
        return new ResponseEntity<>("Booking Deleted", HttpStatus.OK);
    }

    // Delete Ticket
    @DeleteMapping("/DeleteTicket/{ticketId}")
    public ResponseEntity<String> deleteTicket(@PathVariable int ticketId) throws CustomException {
        log.info("DELETE /DeleteTicket/{}", ticketId);
        userServices.cancelTicket(ticketId);
        return new ResponseEntity<>("Ticket Deleted", HttpStatus.OK);
    }

    // Route Adding
    @PostMapping("/route")
    public ResponseEntity<Route> addRoute(@RequestBody Route route) {
        log.info("POST /route");
        return new ResponseEntity<>(userServices.route(route), HttpStatus.CREATED);
    }

    // Search Hotels
    @GetMapping("/searchHotel/{name}")
    public ResponseEntity<List<Hotel>> hotels(@PathVariable String name) {
        log.info("GET /searchHotel/{}", name);
        return ResponseEntity.ok(userServices.searchFunction(name));
    }

    // Search Bus
    @GetMapping("/searchBus/{name}")
    public ResponseEntity<List<Bus>> buses(@PathVariable String name) {
        log.info("GET /searchBus/{}", name);
        return ResponseEntity.ok(userServices.searchBus(name));
    }
}