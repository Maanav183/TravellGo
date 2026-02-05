package com.Travellgo.chatbot.util;

public enum IntentType {

    GREETING,

    // Discovery
    VIEW_PACKAGES,
    VIEW_HOTELS,
    VIEW_BUSES,

    // Details
    SELECT_PACKAGE,
    SHOW_PRICE,
    SHOW_DESCRIPTION,

    // Booking flow
    BOOK_PACKAGE,
    CONFIRM_BOOKING,

    // Support
    HELP,
    UNKNOWN
}
