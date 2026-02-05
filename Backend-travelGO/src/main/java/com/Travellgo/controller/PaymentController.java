package com.Travellgo.controller;

import com.Travellgo.service.PaymentService;
import com.Travellgo.service.UserServices;
import com.razorpay.RazorpayException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "http://localhost:5173") // Allow frontend access
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private UserServices userServices;

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> data) {
        try {
            int amount = (int) data.get("amount");
            String orderResponse = paymentService.createOrder(amount);
            return ResponseEntity.ok(orderResponse);
        } catch (RazorpayException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating order: " + e.getMessage());
        }
    }

    @PostMapping("/verify-booking")
    public ResponseEntity<?> verifyAndBook(@RequestBody Map<String, Object> data) {
        try {
            String orderId = (String) data.get("razorpay_order_id");
            String paymentId = (String) data.get("razorpay_payment_id");
            String signature = (String) data.get("razorpay_signature");

            // Booking Details
            int customerId = Integer.parseInt(data.get("customerId").toString());
            int packageId = Integer.parseInt(data.get("packageId").toString());
            String date = (String) data.get("date"); // YYYY-MM-DD

            boolean isValid = paymentService.verifySignature(orderId, paymentId, signature);

            if (isValid) {
                // Payment Verified -> Create Booking
                userServices.bookPackage(customerId, packageId, date);
                return ResponseEntity.ok("Booking Successful");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Payment Verification Failed");
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error verifying booking: " + e.getMessage());
        }
    }
}
