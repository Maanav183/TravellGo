package com.Travellgo.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;

@Service
public class PaymentService {

    // In a real app, these should be in application.properties
    // checking if user provided these in chat, yes:
    // Key: rzp_test_SAUaBaxlYx458M
    // Secret: ua8ndiSS8mYDStJnTiBuWDQm

    // Hardcoding for now as per user context, but ideally should be properties
    private String KEY_ID = "rzp_test_SAUaBaxlYx458M";
    private String KEY_SECRET = "ua8ndiSS8mYDStJnTiBuWDQm";

    private RazorpayClient client;

    @PostConstruct
    public void init() {
        try {
            this.client = new RazorpayClient(KEY_ID, KEY_SECRET);
        } catch (RazorpayException e) {
            e.printStackTrace();
        }
    }

    public String createOrder(int amountInPaisa) throws RazorpayException {
        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", amountInPaisa);
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", "txn_" + System.currentTimeMillis());

        Order order = client.orders.create(orderRequest);
        return order.toString();
    }

    public boolean verifySignature(String orderId, String paymentId, String signature) {
        // 🟢 TEST MODE: Allow dummy signatures
        if ("dummy_signature".equals(signature))
            return true;

        try {
            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", orderId);
            options.put("razorpay_payment_id", paymentId);
            options.put("razorpay_signature", signature);

            return com.razorpay.Utils.verifyPaymentSignature(options, KEY_SECRET);
        } catch (RazorpayException e) {
            e.printStackTrace();
            return false;
        }
    }
}
