package com.Travellgo.chatbot.util;

public class ChatContext {

    private String selectedPackageName;
    private IntentType lastIntent;

    public String getSelectedPackageName() {
        return selectedPackageName;
    }

    public void setSelectedPackageName(String selectedPackageName) {
        this.selectedPackageName = selectedPackageName;
    }

    public IntentType getLastIntent() {
        return lastIntent;
    }

    public void setLastIntent(IntentType lastIntent) {
        this.lastIntent = lastIntent;
    }
}
