package com.Travellgo.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.Travellgo.utils.JwtUtil;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin
public class AuthController {

        private static final Logger log = LoggerFactory.getLogger(AuthController.class);

        @Autowired
        private AuthenticationManager authenticationManager;

        @Autowired
        private JwtUtil jwtUtil;

        @Autowired
        private com.Travellgo.repository.CustomerRepo customerRepo;

        @Autowired
        private com.Travellgo.service.EmailService emailService;

        @Autowired
        private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

        // Simple in-memory OTP storage (Email -> OTP)
        private Map<String, String> otpStorage = new java.util.HashMap<>();

        @PostMapping("/login")
        public java.util.Map<String, Object> login(@RequestBody Map<String, String> body) {
                String email = body.get("email");
                String password = body.get("password");

                log.info("POST /auth/login email={}", email);

                Authentication authentication = authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                email,
                                                password));

                String username = email;
                String role = authentication
                                .getAuthorities()
                                .iterator()
                                .next()
                                .getAuthority();

                String token = jwtUtil.generateToken(username, role);
                com.Travellgo.entity.Customer customer = customerRepo.findByEmail(email).orElse(null);

                log.info("Login successful email={} role={}", email, role);

                java.util.Map<String, Object> response = new java.util.HashMap<>();
                response.put("token", token);
                response.put("user", customer);
                return response;
        }

        @PostMapping("/forgot-password")
        public java.util.Map<String, String> forgotPassword(@RequestBody Map<String, String> body) {
                String email = body.get("email");
                com.Travellgo.entity.Customer customer = customerRepo.findByEmail(email).orElse(null);

                java.util.Map<String, String> response = new java.util.HashMap<>();
                if (customer == null) {
                        response.put("message", "User not found");
                        return response;
                }

                // Generate 6-digit OTP
                String otp = String.valueOf(new java.util.Random().nextInt(900000) + 100000);
                otpStorage.put(email, otp);

                // Send Email
                emailService.sendEmail(email, "Password Reset OTP", "Your OTP for password reset is: " + otp);

                response.put("message", "OTP sent to your email");
                return response;
        }

        @PostMapping("/reset-password")
        public java.util.Map<String, String> resetPassword(@RequestBody Map<String, String> body) {
                String email = body.get("email");
                String otp = body.get("otp");
                String newPassword = body.get("newPassword");

                java.util.Map<String, String> response = new java.util.HashMap<>();

                if (!otpStorage.containsKey(email) || !otpStorage.get(email).equals(otp)) {
                        response.put("message", "Invalid or expired OTP");
                        return response;
                }

                com.Travellgo.entity.Customer customer = customerRepo.findByEmail(email).orElse(null);
                if (customer != null) {
                        customer.setPassword(passwordEncoder.encode(newPassword));
                        customerRepo.save(customer);
                        otpStorage.remove(email); // Clear OTP
                        response.put("message", "Password reset successful");
                } else {
                        response.put("message", "User not found");
                }

                return response;
        }
}