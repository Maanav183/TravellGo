package com.Travellgo.chatbot.util;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class ChatContextStore {

    private static final Map<String, ChatContext> CONTEXT_MAP =
            new ConcurrentHashMap<>();

    public static ChatContext getContext(String sessionId) {
        return CONTEXT_MAP.computeIfAbsent(sessionId, k -> new ChatContext());
    }

    public static void clearContext(String sessionId) {
        CONTEXT_MAP.remove(sessionId);
    }
}
