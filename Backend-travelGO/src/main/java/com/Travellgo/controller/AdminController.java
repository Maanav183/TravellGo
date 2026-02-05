package com.Travellgo.controller;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.Travellgo.entity.Bus;
import com.Travellgo.entity.Hotel;
import com.Travellgo.entity.Packages;
import com.Travellgo.service.AdminServices;
import com.Travellgo.exception.CustomException;

@RestController
@CrossOrigin(origins = "*")
public class AdminController {

    private static final Logger log = LoggerFactory.getLogger(AdminController.class);

    @Autowired
    private AdminServices adminServices;

    // Add Hotel
    @PostMapping("/addHotel")
    public ResponseEntity<Hotel> addHotel(@RequestBody Hotel hotel) throws CustomException {
        log.info("POST /addHotel");
        return new ResponseEntity<>(adminServices.addHotel(hotel), HttpStatus.CREATED);
    }

    // Add Package
    @PostMapping("/addPackage")
    public ResponseEntity<Packages> addPackage(@RequestBody Packages pack) throws CustomException {
        log.info("POST /addPackage");
        return new ResponseEntity<>(adminServices.addPackages(pack), HttpStatus.CREATED);
    }

    // Add Bus
    @PostMapping("/addBus")
    public ResponseEntity<Bus> addBus(@RequestBody Bus bus) throws CustomException {
        log.info("POST /addBus");
        return new ResponseEntity<>(adminServices.addBus(bus), HttpStatus.CREATED);
    }

    // View All Bookings (Custom Map logic)
    @GetMapping("/allBookings")
    public ResponseEntity<List<Map<String, String>>> viewAllBooking() {
        log.info("GET /allBookings");
        return ResponseEntity.ok(adminServices.viewAllBookings());
    }

    // Delete Hotel
    @DeleteMapping("/deleteHotel/{hotelId}")
    public ResponseEntity<String> deleteHotel(@PathVariable int hotelId) throws CustomException {
        log.info("DELETE /deleteHotel/{}", hotelId);
        adminServices.deleteHotel(hotelId);
        return new ResponseEntity<>("Hotel Deleted Successfully", HttpStatus.OK);
    }

    // Delete Package
    @DeleteMapping("/deletePackage/{packageId}")
    public ResponseEntity<String> deletePackage(@PathVariable int packageId) throws CustomException {
        log.info("DELETE /deletePackage/{}", packageId);
        adminServices.deletePackages(packageId);
        return new ResponseEntity<>("Package Deleted Successfully", HttpStatus.OK);
    }

    // Delete Bus
    @DeleteMapping("/deleteBus/{busId}")
    public ResponseEntity<String> deleteBus(@PathVariable int busId) throws CustomException {
        log.info("DELETE /deleteBus/{}", busId);
        adminServices.deleteBus(busId);
        return new ResponseEntity<>("Bus Deleted Successfully", HttpStatus.OK);
    }
}