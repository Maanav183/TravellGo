package com.Travellgo.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.Travellgo.entity.Booking;
import com.Travellgo.entity.Bus;
import com.Travellgo.entity.Hotel;
import com.Travellgo.entity.Packages;
import com.Travellgo.repository.*;
import com.Travellgo.exception.CustomException;
import com.Travellgo.constant.ErrorConstant; // Make sure this matches your package

@Service
@Transactional
public class AdminServices {

    private static final Logger log = LoggerFactory.getLogger(AdminServices.class);

    @Autowired
    private BookingRepo bookingRepo;
    @Autowired
    private BusRepo busRepo;
    @Autowired
    private HotelRepo hotelRepo;
    @Autowired
    private TicketRepo ticketRepo;
    @Autowired
    private PackageRepo packageRepo; // 🟢 Restored

    // ----------------------------------------------------------------
    // VIEW RESOURCES (READ)
    // ----------------------------------------------------------------

    public List<Packages> viewAllPackages() {
        log.debug("AdminServices.viewAllPackages called");
        return packageRepo.findAll();
    }

    public List<Hotel> viewAllHotels() {
        log.debug("AdminServices.viewAllHotels called");
        return hotelRepo.findAll();
    }

    public List<Bus> viewAllBus() {
        log.debug("AdminServices.viewAllBus called");
        return busRepo.findAll();
    }

    // ----------------------------------------------------------------
    // ADD RESOURCES (WRITE)
    // ----------------------------------------------------------------

    public Hotel addHotel(Hotel hotel) {
        log.info("AdminServices.addHotel name={}", hotel != null ? hotel.getHotelName() : null);
        if (hotel == null || hotel.getHotelName() == null) {
            throw new CustomException(ErrorConstant.VALIDATION_ERROR, HttpStatus.BAD_REQUEST);
        }
        Hotel saved = hotelRepo.save(hotel);
        log.info("AdminServices.addHotel saved id={}", saved.getHotelId());
        return saved;
    }

    public Packages addPackages(Packages packages) {
        log.info("AdminServices.addPackages name={}", packages != null ? packages.getPackageName() : null);
        if (packages == null || packages.getPackageName() == null) {
            throw new CustomException(ErrorConstant.VALIDATION_ERROR, HttpStatus.BAD_REQUEST);
        }
        Packages saved = packageRepo.save(packages);
        log.info("AdminServices.addPackages saved id={}", saved.getPackageId());
        return saved;
    }

    public Bus addBus(Bus bus) {
        log.info("AdminServices.addBus travelAgency={}", bus != null ? bus.getTravelAgency() : null);
        if (bus == null) {
            throw new CustomException(ErrorConstant.VALIDATION_ERROR, HttpStatus.BAD_REQUEST);
        }
        Bus saved = busRepo.save(bus);
        log.info("AdminServices.addBus saved id={}", saved.getBusId());
        return saved;
    }

    // ----------------------------------------------------------------
    // REPORTING / AGGREGATION
    // ----------------------------------------------------------------

    public List<Map<String, String>> viewAllBookings() {
        log.debug("AdminServices.viewAllBookings called");
        List<Booking> allBookings = bookingRepo.findAll();
        List<Map<String, String>> bookingDetailsList = new ArrayList<>();

        // 1. Process Hotel & Package Bookings
        for (Booking booking : allBookings) {
            if (booking.getCustomer() == null) {
                log.warn("Skipping booking without customer, id={}", booking.getBookingId());
                continue;
            }

            Map<String, String> bookingDetails = new HashMap<>();
            bookingDetails.put("BookingId", String.valueOf(booking.getBookingId()));
            bookingDetails.put("Date", String.valueOf(booking.getBookingDate()));
            bookingDetails.put("CustomerName", booking.getCustomer().getName());
            bookingDetails.put("BookingTitle", booking.getBookingTitle());

            if ("Hotel Booking".equals(booking.getBookingTitle()) && !booking.getHotels().isEmpty()) {
                Hotel hotel = booking.getHotels().get(0);
                bookingDetails.put("Type", "Hotel");
                bookingDetails.put("Details", hotel.getHotelName());
                bookingDetails.put("Price", String.valueOf(hotel.getRent()));
            } else if (!booking.getPackages().isEmpty()) {
                Packages pack = booking.getPackages().get(0);
                bookingDetails.put("Type", "Package");
                bookingDetails.put("Details", pack.getPackageName());
                bookingDetails.put("Price", String.valueOf(pack.getCost()));
            } else {
                bookingDetails.put("Type", "Unknown");
                bookingDetails.put("Details", "N/A");
                bookingDetails.put("Price", "0.0");
            }

            bookingDetailsList.add(bookingDetails);
        }

        // 2. Process Bus Tickets (New Logic)
        List<com.Travellgo.entity.Ticket> allTickets = ticketRepo.findAll();
        for (com.Travellgo.entity.Ticket ticket : allTickets) {
            if (ticket.getCustomer() == null)
                continue;

            Map<String, String> ticketDetails = new HashMap<>();
            ticketDetails.put("BookingId", "B" + ticket.getTicketId()); // Prefix to distinguish
            // Use route date or fallback to today if missing
            String date = (ticket.getRoute() != null && ticket.getRoute().getDateOfJourney() != null)
                    ? ticket.getRoute().getDateOfJourney().toString()
                    : java.time.LocalDate.now().toString();
            ticketDetails.put("Date", date);
            ticketDetails.put("CustomerName", ticket.getCustomer().getName());
            ticketDetails.put("BookingTitle", "Bus Ticket");
            ticketDetails.put("Type", "Bus");

            String routeInfo = (ticket.getRoute() != null)
                    ? ticket.getRoute().getRouteFrom() + " - " + ticket.getRoute().getRouteTo()
                    : "Unknown Route";
            ticketDetails.put("Details", routeInfo + " (Seat " + ticket.getSeatNumber() + ")");

            String price = (ticket.getBus() != null) ? String.valueOf(ticket.getBus().getFare()) : "0.0";
            ticketDetails.put("Price", price);

            bookingDetailsList.add(ticketDetails);
        }

        log.debug("AdminServices.viewAllBookings returning {} records", bookingDetailsList.size());
        return bookingDetailsList;
    }

    // ----------------------------------------------------------------
    // DELETE RESOURCES
    // ----------------------------------------------------------------

    public void deleteBus(int busId) {
        log.info("AdminServices.deleteBus id={}", busId);
        Bus bus = busRepo.findById(busId)
                .orElseThrow(() -> new CustomException(ErrorConstant.BUS_NOT_FOUND, HttpStatus.NOT_FOUND));
        busRepo.delete(bus);
        log.info("Deleted bus id={}", busId);
    }

    public void deleteHotel(int hotelId) {
        log.info("AdminServices.deleteHotel id={}", hotelId);
        Hotel hotel = hotelRepo.findById(hotelId)
                .orElseThrow(() -> new CustomException(ErrorConstant.HOTEL_NOT_FOUND, HttpStatus.NOT_FOUND));
        hotelRepo.delete(hotel);
        log.info("Deleted hotel id={}", hotelId);
    }

    public void deletePackages(int packageId) {
        log.info("AdminServices.deletePackages id={}", packageId);
        Packages pack = packageRepo.findById(packageId)
                .orElseThrow(() -> new CustomException(ErrorConstant.PACKAGE_NOT_FOUND, HttpStatus.NOT_FOUND));
        packageRepo.delete(pack);
        log.info("Deleted package id={}", packageId);
    }
}