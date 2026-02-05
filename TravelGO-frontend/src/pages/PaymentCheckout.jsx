// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import { CreditCard, Lock, ShieldCheck, CheckCircle, ArrowRight } from 'lucide-react';
// import "../style/PaymentCheckout.css";

// import { useLocation, useNavigate } from "react-router-dom";

// const location = useLocation();
// const navigate = useNavigate();

// const { plan, city, bookingData, totalAmount } = location.state || {};





// const PaymentCheckout = () => {
//   const [paymentStep, setPaymentStep] = useState('details'); // details, processing, success

//   const handlePayment = async (e) => {
//   e.preventDefault();

//   try {
//     // STEP 1: Call backend to create Razorpay order
//     const res = await fetch("http://localhost:8888/api/payment/create-order", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         // If you use JWT, uncomment next line
//         // "Authorization": `Bearer ${localStorage.getItem("token")}`
//       },
//       body: JSON.stringify({
//         amount: totalAmount, // example: 1200 (INR)
//       }),
//     });

//     const data = await res.json();
//     console.log("Order from backend:", data);

//     // STEP 2: Open Razorpay Checkout
//     openRazorpay(data);

//   } catch (err) {
//     console.error("Payment failed:", err);
//     alert("Something went wrong. Please try again.");
//   }
// };

// const openRazorpay = (orderData) => {
//   const options = {
//     key: "rzp_test_XXXXXXXX", // 🔴 use TEST key only
//     amount: orderData.amount,
//     currency: orderData.currency,
//     order_id: orderData.orderId,
//     name: "TravelGO",
//     description: "Trip Booking Payment",
//     handler: function (response) {
//       console.log("Payment success:", response);

//       /*
//         response contains:
//         - razorpay_payment_id
//         - razorpay_order_id
//         - razorpay_signature
//       */

//       // NEXT STEP (later):
//       // send this response to backend for verification
//     },
//     theme: {
//       color: "#0a2540",
//     },
//   };

//   const rzp = new window.Razorpay(options);
//   rzp.open();
// };


//   if (paymentStep === 'success') {
//     return (
//       <div className="success-container">
//         <motion.div 
//           initial={{ scale: 0.8, opacity: 0 }} 
//           animate={{ scale: 1, opacity: 1 }}
//           className="success-card"
//         >
//           <CheckCircle size={80} className="success-icon" />
//           <h1>Booking Confirmed!</h1>
//           <p>Pack your bags! Your journey details have been sent to your email.</p>
//           <button className="dest-btn-primary" onClick={() => window.location.href = '/mybookings'}>
//             View My Bookings
//           </button>
//         </motion.div>
//       </div>
//     );
//   }

//   return (
//     <div className="checkout-root">
//       <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">

//         {/* Left Column: Payment Form */}
//         <div className="lg:col-span-2">
//           <h1 className="text-3xl font-black text-slate-900 mb-8">Secure Checkout</h1>

//          <div className="lg:col-span-2">
//   <h1 className="text-3xl font-black text-slate-900 mb-8">Secure Checkout</h1>

//   <form className="payment-form" onSubmit={handlePayment}>
//     <section className="payment-section">
//       <h3 className="section-subtitle">Payment Method</h3>

//       <div className="payment-options">
//         <div className="payment-opt active">
//           <CreditCard size={20} />
//           <span>UPI / Card / NetBanking</span>
//         </div>
//       </div>

//       <p className="payment-note">
//         You’ll be redirected to our secure payment partner to complete the transaction.
//       </p>
//     </section>

//     <button
//       type="submit"
//       className="pay-now-btn"
//       disabled={paymentStep === "processing"}
//     >
//       {paymentStep === "processing"
//         ? "Processing..."
//         : "Pay & Confirm Booking"}
//     </button>

//     <div className="security-footer">
//       <Lock size={14} /> Secured by Razorpay • PCI-DSS Compliant
//     </div>
//   </form>
// </div>

//         </div>

//         {/* Right Column: Trip Summary */}
//         <aside className="checkout-sidebar">
//           <div className="summary-card">
//             <h3 className="font-bold text-slate-900 mb-4">Trip Summary</h3>
//             <div className="summary-image">
//               <img src="/images/manali.jpg" alt="Manali" />
//             </div>
//             <div className="summary-details mt-4">
//               <h4 className="text-xl font-black text-slate-900">Manali Adventure</h4>
//               <p className="text-slate-500">3 Nights / 4 Days • 1 Adult</p>
//             </div>

//             <hr className="my-6 border-slate-100" />

//             <div className="price-breakdown space-y-3">
//               <div className="flex justify-between">
//                 <span>Base Fare</span>
//                 <span>₹11,000</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Taxes & Fees</span>
//                 <span>₹1,450</span>
//               </div>
//               <div className="flex justify-between font-black text-xl text-slate-900 pt-4 border-t border-slate-100">
//                 <span>Total Amount</span>
//                 <span>₹12,450</span>
//               </div>
//             </div>

//             <div className="trust-badge mt-8">
//               <ShieldCheck size={20} className="text-green-600" />
//               <span>Money-back guarantee if cancelled within 24h</span>
//             </div>
//           </div>
//         </aside>
//       </div>
//     </div>
//   );
// };

// export default PaymentCheckout;









import React, { useState } from "react";
import { CreditCard, Lock, ShieldCheck } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../style/PaymentCheckout.css";

const PaymentCheckout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { plan, city, bookingData, totalAmount } = location.state || {};
  const [paymentStep, setPaymentStep] = useState("details");

  // SAFETY CHECK
  if (!plan || !city || !bookingData || !totalAmount) {
    return (
      <div style={{ padding: "80px", textAlign: "center" }}>
        <h2>Invalid payment request</h2>
        <button onClick={() => navigate("/packages")}>Go Back</button>
      </div>
    );
  }

  // LOAD RAZORPAY SCRIPT
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // HANDLE PAYMENT
  const handlePayment = async (e) => {
    e.preventDefault();
    setPaymentStep("processing");

    // 1. Get User ID from LocalStorage
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      alert("Please login to book.");
      navigate("/login");
      return;
    }
    const user = JSON.parse(userStr);
    // Support both 'id' and 'userId' depending on what the auth flow saves
    const customerId = user.id || user.userId;

    if (!customerId) {
      alert("Invalid user session. Please login again.");
      return;
    }

    try {
      // 2. Load Razorpay SDK
      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        alert("Razorpay SDK failed to load. Are you online?");
        setPaymentStep("details");
        return;
      }

      // 3. Create Order on Backend
      // The backend expects json body, our api.js sends it.
      const orderRes = await api.payment.createOrder(Math.round(totalAmount * 100));

      // Handle potential response formats (stringified JSON vs object)
      const orderData = typeof orderRes.data === 'string' ? JSON.parse(orderRes.data) : orderRes.data;

      const options = {
        key: "rzp_test_SAUaBaxlYx458M",
        amount: orderData.amount,
        currency: orderData.currency,
        name: "TravelGO",
        description: plan.title,
        order_id: orderData.id, // Use the Backend-generated Order ID
        handler: async function (response) {
          try {
            // 4. Verify Payment & Create Booking on Backend
            const verificationData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              customerId: customerId,
              packageId: plan.id,
              date: bookingData.date
            };

            await api.payment.verifyBooking(verificationData);

            // 5. Success!
            // We can optionally update local storage here if the app relies on it for "My Bookings" page immediately,
            // but the backend DB is now the source of truth.
            // As a fallback/cache for current session:
            const booking = {
              id: "PKG-" + Date.now(),
              type: "Package",
              title: plan.title,
              destination: city.cityName,
              date: bookingData.date,
              travelers: bookingData.guests,
              totalAmount: totalAmount,
              paymentId: response.razorpay_payment_id,
              status: "Paid",
            };
            const existing = JSON.parse(localStorage.getItem("allBookings")) || [];
            localStorage.setItem("allBookings", JSON.stringify([booking, ...existing]));
            window.dispatchEvent(new Event('storage'));

            navigate("/bookingsuccess");

          } catch (verifyErr) {
            console.error("Verification failed", verifyErr);
            alert("Payment check failed or Booking could not be saved. Please contact support.");
            setPaymentStep("details");
          }
        },
        prefill: {
          name: user.name || "User",
          email: user.email || "",
          contact: user.mobile || "",
        },
        theme: {
          color: "#0a2540",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        alert("Payment Failed: " + response.error.description);
        setPaymentStep("details");
      });

      rzp.open();

    } catch (err) {
      console.error("Payment initiation failed", err);
      alert("Failed to initiate payment. Server might be down.");
      setPaymentStep("details");
    }
  };

  return (
    <div className="checkout-root">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* LEFT */}
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-black mb-8">Secure Checkout</h1>

          <form className="payment-form" onSubmit={handlePayment}>
            <section className="payment-section">
              <h3 className="section-subtitle">Payment Method</h3>

              <div className="payment-options">
                <div className="payment-opt active">
                  <CreditCard size={20} />
                  <span>UPI / Card / NetBanking</span>
                </div>
              </div>

              <p className="payment-note">
                You’ll be redirected to Razorpay to complete payment.
              </p>
            </section>

            <button
              type="submit"
              className="pay-now-btn"
              disabled={paymentStep === "processing"}
            >
              {paymentStep === "processing"
                ? "Processing..."
                : `Pay ₹${totalAmount.toLocaleString("en-IN")}`}
            </button>

            <div className="security-footer">
              <Lock size={14} /> Secured by Razorpay
            </div>

            {/* 🟢 TEST MODE BUTTON */}
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <button type="button" onClick={async () => {
                // Dummy Verification
                try {
                  const userStr = localStorage.getItem("user");
                  if (!userStr) { alert("Login required"); return; }
                  const user = JSON.parse(userStr);
                  const customerId = user.id || user.userId;

                  await api.payment.verifyBooking({
                    razorpay_order_id: "order_dummy_" + Date.now(),
                    razorpay_payment_id: "pay_dummy",
                    razorpay_signature: "dummy_signature",
                    customerId: customerId,
                    packageId: plan.id,
                    date: bookingData.date
                  });
                  navigate("/bookingsuccess");
                } catch (e) {
                  alert("Dummy Payment Failed: " + e.message);
                }
              }} style={{ background: '#475569', color: 'white', padding: '8px 15px', borderRadius: '5px', fontSize: '0.8rem' }}>
                🛠️ Test Pay (Bypass)
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT */}
        <aside className="checkout-sidebar">
          <div className="summary-card">
            <h3>Trip Summary</h3>

            <h4>{plan.title}</h4>
            <p>
              {city.cityName} • {bookingData.guests} Guests
            </p>

            <hr />

            <div className="price-breakdown">
              <div className="flex justify-between font-bold">
                <span>Total Amount</span>
                <span>₹{totalAmount.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div className="trust-badge mt-6">
              <ShieldCheck size={20} />
              <span>100% secure payment</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default PaymentCheckout;
