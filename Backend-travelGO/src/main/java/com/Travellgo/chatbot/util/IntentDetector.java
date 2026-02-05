package com.Travellgo.chatbot.util;

public class IntentDetector {

    public static IntentType detect(String message) {

        if (message == null || message.isBlank()) {
            return IntentType.UNKNOWN;
        }

        message = message.toLowerCase().trim();

        // 1️⃣ Greetings
        if (message.matches("^(hi|hello|hey|hii|hey there|hello bot).*")) {
            return IntentType.GREETING;
        }

        // 2️⃣ PRICE — MUST COME BEFORE PACKAGE
        if (message.contains("price") || message.contains("cost")) {
            return IntentType.SHOW_PRICE;
        }

        // 3️⃣ View packages
        if (message.contains("package")) {
            return IntentType.VIEW_PACKAGES;
        }

        // 4️⃣ Hotels
        if (message.contains("hotel")) {
            return IntentType.VIEW_HOTELS;
        }

        // 5️⃣ Bus
        if (message.contains("bus")) {
            return IntentType.VIEW_BUSES;
        }

        // 6️⃣ Booking
        if (message.contains("book")) {
            return IntentType.BOOK_PACKAGE;
        }

        return IntentType.UNKNOWN;
    }
}
