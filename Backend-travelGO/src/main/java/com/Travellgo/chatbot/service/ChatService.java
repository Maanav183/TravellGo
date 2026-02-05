package com.Travellgo.chatbot.service;

import java.util.ArrayList;
import java.util.List;

import com.Travellgo.entity.Bus;
import com.Travellgo.entity.Hotel;
import com.Travellgo.service.AdminServices;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Travellgo.entity.Packages;
import com.Travellgo.chatbot.dto.ChatRequest;
import com.Travellgo.chatbot.dto.ChatResponse;
import com.Travellgo.chatbot.util.IntentDetector;
import com.Travellgo.chatbot.util.IntentType;
import com.Travellgo.chatbot.util.ChatContext;
import com.Travellgo.chatbot.util.ChatContextStore;

@Service
public class ChatService {

    private static final Logger log = LoggerFactory.getLogger(ChatService.class);

    @Autowired
    AdminServices adminServices;

    public ChatService(AdminServices adminServices) {
        this.adminServices = adminServices;
    }

    private List<String> formatPackages(List<Packages> packages) {
        List<String> response = new ArrayList<>();
        for (Packages p : packages) {
            String text =
                    "📦 " + p.getPackageName() +
                            " | Type: " + p.getPackageType() +
                            " | Cost: ₹" + p.getCost() +
                            " | Description: " + p.getPackageDescription();
            response.add(text);
        }
        return response;
    }

    private List<String> formatHotels(List<Hotel> hotels) {
        List<String> response = new ArrayList<>();
        for (Hotel h : hotels) {
            String text =
                    "🏨 " + h.getHotelName() +
                            " | City: " + h.getCity() +
                            " | Type: " + h.getHotelType() +
                            " | Rent: ₹" + h.getRent() +
                            " | Status: " + h.getStatus();
            response.add(text);
        }
        return response;
    }

    private List<String> formatBuses(List<Bus> buses) {
        List<String> response = new ArrayList<>();
        for (Bus b : buses) {
            String text =
                    "🚌 " + b.getTravelAgency() +
                            " | Type: " + b.getBusType() +
                            " | Capacity: " + b.getCapacity() +
                            " | Fare: ₹" + b.getFare();
            response.add(text);
        }
        return response;
    }

    public ChatResponse processMessage(ChatRequest request) {

        String sessionId = request.getSessionId();
        String message = request.getMessage().toLowerCase().trim();

        log.info("Chat processMessage sessionId={} message='{}'", sessionId, message);

        ChatContext context = ChatContextStore.getContext(sessionId);

        List<Packages> allPackages = adminServices.viewAllPackages();
        List<Hotel> allHotels = adminServices.viewAllHotels();
        List<Bus> allBuses = adminServices.viewAllBus();

        for (Packages p : allPackages) {
            String firstWord = p.getPackageName().toLowerCase().split(" ")[0];
            if (message.contains(firstWord)) {
                context.setSelectedPackageName(p.getPackageName());
                break;
            }
        }

        IntentType intent = IntentDetector.detect(message);
        context.setLastIntent(intent);
        log.debug("Chat detected intent={} sessionId={}", intent, sessionId);

        switch (intent) {

            case GREETING:
                return new ChatResponse(
                        "Hello 👋 Welcome to Travellgo! You can ask me about tour packages and prices."
                );

            case VIEW_PACKAGES:
                return new ChatResponse(
                        "Here are our available tour packages:",
                        formatPackages(allPackages)
                );

            case SHOW_PRICE:

                if (context.getSelectedPackageName() != null) {
                    for (Packages p : allPackages) {
                        if (p.getPackageName().equalsIgnoreCase(context.getSelectedPackageName())) {
                            return new ChatResponse(
                                    "💰 The price of " + p.getPackageName() + " package is ₹" + p.getCost()
                            );
                        }
                    }
                }

                return new ChatResponse(
                        "Please tell me which package you want the price for."
                );

            case VIEW_HOTELS:

                if (allHotels.isEmpty()) {
                    return new ChatResponse("Sorry 😕 No hotels are available right now.");
                }

                return new ChatResponse(
                        "🏨 Here are our available hotels:",
                        formatHotels(allHotels)
                );

            case VIEW_BUSES:

                if (allBuses.isEmpty()) {
                    return new ChatResponse("Sorry 😕 No buses are available right now.");
                }

                return new ChatResponse(
                        "🚌 Here are the available bus services:",
                        formatBuses(allBuses)
                );

            default:
                return new ChatResponse(
                        "Sorry 😕 I didn’t understand that. Try asking about packages or prices."
                );
        }
    }

}