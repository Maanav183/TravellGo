package com.Travellgo.chatbot.dto;

public class ChatResponse {

    private String reply;
    private Object data;

    public ChatResponse(String reply) {
        this.reply = reply;
    }

    public ChatResponse(String reply, Object data) {
        this.reply = reply;
        this.data = data;
    }

    public String getReply() {
        return reply;
    }

    public Object getData() {
        return data;
    }
}
