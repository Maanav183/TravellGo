# Travellgo - Project Overview

**Travellgo** is a comprehensive Tour and Travel Management System designed to facilitate seamless booking experiences for buses, hotels, and holiday packages. It features a robust backend API and a modern, responsive frontend interface.

## Tech Stack

### Frontend
-   **Framework**: React 19
-   **Build Tool**: Vite
-   **Styling**: Tailwind CSS (v4), Plain CSS
-   **Animation**: Framer Motion
-   **Maps**: Leaflet / React-Leaflet
-   **Routing**: React Router DOM (v7)
-   **HTTP Client**: Axios
-   **Icons**: Lucide React

### Backend
-   **Framework**: Spring Boot 3.2.5 (Java 21)
-   **Database**: MySQL
-   **ORM**: JPA / Hibernate
-   **Security**: Spring Security (JWT support present in dependencies)
-   **API Documentation**: Swagger UI / OpenAPI (SpringDoc)
-   **Payment Gateway**: Razorpay
-   **Email**: Spring Boot Starter Mail
-   **Tools**: Lombok, Spring Boot DevTools

---

## Key Features

### 1. User Management
-   **Authentication**: Secure login and registration flows.
-   **Roles**: Support for different user roles (Likely `USER`, `ADMIN`).
-   **Profile**: Users can manage their profiles.

### 2. Booking System
-   **Bus Booking**: Search and book bus tickets.
-   **Hotel Booking**: Browse and reserve hotels.
-   **Package Booking**: Curated holiday packages for different destinations.
-   **Booking Management**: "My Bookings" section for users to view and manage their reservations.

### 3. Admin Dashboard
-   **Management**: Admins can manage inventory (Buses, Hotels, Packages).
-   **Dashboard**: Visual overview of system status and bookings.

### 4. Interactive Features
-   **Maps**: Integration with Leaflet maps for location visualization (e.g., Hotel locations, Destination views).
-   **Chatbot**: AI-powered or rule-based chatbot for user assistance `src/components/chatbot/Chatbot.jsx`.
-   **Payment Integration**: Secure payments powered by Razorpay.

## Project Structure

### `Backend-travelGO`
-   **Controller**: REST Endpoints handling HTTP requests (`com.Travellgo.Controller`).
-   **Entity**: Database models mapped via JPA.
-   **Service**: Business logic layer.
-   **Repository**: Data access layer interfacing with MySQL.
-   **Configuration**: Security, CORS, and Swagger configs.

### `TravelGO-frontend`
-   **`src/components`**: Reusable UI components (Navbar, Footer, Cards, etc.).
-   **`src/pages`**: Main application views mapped to routes.
-   **`src/style`**: Custom CSS files.
-   **`src/services`** (Assumed): API integration logic using Axios.

## Payment Flow (Razorpay)
1.  User initiates booking.
2.  Backend creates a Razorpay Order and returns Order ID.
3.  Frontend opens Razorpay Checkout.
4.  On success, payment verification is sent to the backend.
5.  Booking is confirmed and ticket/email is generated.

