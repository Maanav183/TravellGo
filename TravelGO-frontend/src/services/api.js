// src/services/api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8888';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response, // Return full response, let caller handle data
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

const api = {
  // Auth endpoints
  auth: {
    login: (credentials) => apiClient.post('/auth/login', credentials),
    signup: (userData) => apiClient.post('/userSignUp', userData),
    forgotPassword: (email) => apiClient.post('/auth/forgot-password', { email }),
    resetPassword: (data) => apiClient.post('/auth/reset-password', data),
  },

  // User endpoints
  user: {
    getPackages: () => apiClient.get('/Packages'),
    getHotels: () => apiClient.get('/Hotels'),
    getBuses: () => apiClient.get('/Buses'),
    searchHotel: (name) => apiClient.get(`/searchHotel/${name}`),
    searchBus: (name) => apiClient.get(`/searchBus/${name}`),

    bookHotel: (customerId, hotelId, date) =>
      apiClient.post(`/bookHotel/${customerId}/${hotelId}?date=${date}`),
    bookPackage: (customerId, packageId, date) =>
      apiClient.post(`/bookPackage/${customerId}/${packageId}?date=${date}`),
    bookBus: (customerId, routeId, busId, seatNumber) =>
      apiClient.post(`/bookBus/${customerId}/${routeId}/${busId}?seatNumber=${seatNumber}`),

    getBookedSeats: (routeId) => apiClient.get(`/bookedSeats/${routeId}`),

    getTickets: (customerId) => apiClient.get(`/YourTicket/${customerId}`),
    getBookings: (customerId) => apiClient.get(`/YourBookings/${customerId}`),

    // Get User Reviews
    getReviews: (customerId) => apiClient.get(`/YourReviews/${customerId}`),

    cancelHotelBooking: (bookingId) =>
      apiClient.delete(`/DeleteHotelBooking/${bookingId}`),
    cancelPackageBooking: (bookingId) =>
      apiClient.delete(`/DeletePackageBooking/${bookingId}`),
    cancelTicket: (ticketId) => apiClient.delete(`/DeleteTicket/${ticketId}`),

    cancelTicket: (ticketId) => apiClient.delete(`/DeleteTicket/${ticketId}`),

    addRoute: (route) => apiClient.post('/route', route),

    // Update User Profile
    updateUser: (customerId, userData) => apiClient.put(`/updateUser/${customerId}`, userData),
  },

  // Admin endpoints
  admin: {
    addHotel: (hotel) => apiClient.post('/addHotel', hotel),
    addPackage: (pkg) => apiClient.post('/addPackage', pkg),
    addBus: (bus) => apiClient.post('/addBus', bus),
    getAllBookings: () => apiClient.get('/allBookings'),
    deleteBus: (id) => apiClient.delete(`/deleteBus/${id}`),
    deleteHotel: (id) => apiClient.delete(`/deleteHotel/${id}`),
    deletePackage: (id) => apiClient.delete(`/deletePackage/${id}`),
  },

  // Payment endpoints (New)
  payment: {
    createOrder: (amount) => apiClient.post('/api/payment/create-order', { amount }),
    verifyBooking: (data) => apiClient.post('/api/payment/verify-booking', data),
  },

  // Chatbot endpoints
  chat: {
    sendMessage: (message, sessionId) =>
      apiClient.post('/api/chat/send', { message, sessionId }),
  },
};


export default api;