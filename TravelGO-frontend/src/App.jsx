import { Route, Routes, useLocation } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";
import LandingPage from './pages/LandingPage';
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import PackagesList from './pages/PackagesList';
import PackageDetails from "./pages/PackageDetails";
import Register from "./pages/Register";
import DestinationsPage from "./pages/DestinationsPage";
import DestinationDetails from "./pages/DestinationDetails";
import HotelsList from "./pages/HotelsList";
import HotelDetails from "./pages/HotelDetails";
import Login from "./pages/Login";
import BookingModal from "./components/BookingModal";
import MyBookings from "./pages/MyBookings";
import UserDashboard from "./pages/UserDashboard";
import PaymentCheckout from "./pages/PaymentCheckout";
import WriteReview from "./pages/WriteReview"; // Added WriteReview Page
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Chatbot from "./components/chatbot/Chatbot";
import BusesPage from "./pages/BusesPage";
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from "./pages/admin/AdminDashboard";
import AddBus from "./pages/admin/AddBus";
import AddHotel from './pages/admin/AddHotel';
import AddPackage from './pages/admin/AddPackage';
import ManageInventory from "./pages/admin/AdminManage";
import ProtectedRoute from './components/ProtectedRoute';
import BookingSuccess from "./components/BookingSuccess";
import FullItinerary from "./components/FullItinerary";

// Helper component to wrap pages in a fade animation

import { ToastProvider } from "./components/Toast";
import { AuthProvider } from "./hooks/useAuth"; // 🟢 ADD AUTH PROVIDER

const AnimatedPage = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.4, ease: "easeInOut" }}
  >
    {children}
  </motion.div>
);

function App() {
  const location = useLocation();

  return (
    <AuthProvider> {/* 🟢 Auth Provider access for all pages */}
      <ToastProvider>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>

            {/* 🔒 Protected Admin Routes */}
            <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/add-bus" element={<ProtectedRoute><AddBus /></ProtectedRoute>} />
            <Route path="/admin/add-hotel" element={<ProtectedRoute><AddHotel /></ProtectedRoute>} />
            <Route path="/admin/add-package" element={<ProtectedRoute><AddPackage /></ProtectedRoute>} />
            <Route path="/admin/ManageInventory" element={<ProtectedRoute><ManageInventory /></ProtectedRoute>} />

            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path='/register' element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            {/* Routes wrapped in MainLayout */}
            <Route element={<MainLayout />}>
              <Route path="/home" element={<AnimatedPage><Home /></AnimatedPage>} />
              <Route path="/buses" element={<AnimatedPage><BusesPage /></AnimatedPage>} />
              {/* 🟢 FIXED: Removed the '+' typo here */}
              <Route path="/packageslist" element={<AnimatedPage><PackagesList /></AnimatedPage>} />
              <Route path="/package-details/:id" element={<AnimatedPage><PackageDetails /></AnimatedPage>} />
              <Route path="/destinations" element={<AnimatedPage><DestinationsPage /></AnimatedPage>} />
              <Route path="/destinations/:id" element={<AnimatedPage><DestinationDetails /></AnimatedPage>} />
              <Route path="/itinerary/:id" element={<AnimatedPage><FullItinerary /></AnimatedPage>} />
              <Route path="/hotels" element={<AnimatedPage><HotelsList /></AnimatedPage>} />
              <Route path="/hotels/:id" element={<AnimatedPage><HotelDetails /></AnimatedPage>} />
              <Route path="/bookingmodal" element={<AnimatePresence> <BookingModal /></AnimatePresence>} />
              <Route path="/mybookings" element={<AnimatedPage><MyBookings /></AnimatedPage>} />
              <Route path="/PaymentCheckout" element={<AnimatedPage><PaymentCheckout /></AnimatedPage>} />
              <Route path="/bookingsuccess" element={<AnimatePresence><BookingSuccess /></AnimatePresence>} />
              <Route path="/write-review/:id" element={<WriteReview />} />
              <Route path="/dashboard" element={<AnimatedPage><UserDashboard /></AnimatedPage>} />
              <Route path="*" element={<h1 style={{ textAlign: "center", marginTop: "50px" }}>Page Not Found</h1>} />
            </Route>
          </Routes>
        </AnimatePresence>

        {/* 🟢 CHATBOT: Visible only on non-public pages */}
        {!['/', '/login', '/register', '/admin/login'].includes(location.pathname) && <Chatbot />}
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;