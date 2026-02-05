package com.Travellgo.utils;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

        // ✅ FIXED KEY (prevents invalidation on restart)
        private static final String SECRET_STRING = "8Zz5tw0Ionm3XPZZfN0NOml3z9FMfmpgXwovR9fp6ryDIoGRM8EPHAB6iHsc0fbW";

        private static final SecretKey SECRET_KEY = Keys.hmacShaKeyFor(SECRET_STRING.getBytes());

        private static final long EXPIRATION_TIME = 1000 * 60 * 60; // 1 hour

        // 🔐 Generate JWT
        public String generateToken(String username, String role) {

                return Jwts.builder()
                                .setSubject(username)
                                .claim("role", role)
                                .setIssuedAt(new Date())
                                .setExpiration(
                                                new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                                .signWith(SECRET_KEY)
                                .compact();
        }

        // ✅ Extract username
        public String extractUsername(String token) {
                return extractAllClaims(token).getSubject();
        }

        // ✅ Validate token
        public boolean isTokenValid(String token) {
                return extractAllClaims(token)
                                .getExpiration()
                                .after(new Date());
        }

        // 🔍 Extract claims
        private Claims extractAllClaims(String token) {
                return Jwts.parserBuilder()
                                .setSigningKey(SECRET_KEY)
                                .build()
                                .parseClaimsJws(token)
                                .getBody();
        }
}
