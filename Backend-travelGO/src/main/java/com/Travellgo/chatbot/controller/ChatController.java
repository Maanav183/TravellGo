package com.Travellgo.chatbot.controller;

import com.Travellgo.chatbot.service.ChatService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Travellgo.chatbot.dto.ChatRequest;
import com.Travellgo.chatbot.dto.ChatResponse;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin
public class ChatController {

    private static final Logger log = LoggerFactory.getLogger(ChatController.class);

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/send")
    public ChatResponse chat(@RequestBody ChatRequest request) {
        log.info("POST /api/chat/send sessionId={}", request.getSessionId());
        return chatService.processMessage(request);
    }
}