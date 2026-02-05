import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from "../../hooks/useAuth";
import api from "../../services/api"; // 🟢 Import API
import "../../style/Chatbot.css";

const Chatbot = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Namaste! I'm your Heritage Guide. How can I help you today?" }
  ]);
  const chatEndRef = useRef(null);

  // 🟢 Persistent Session ID
  const [sessionId] = useState(() => {
    let sid = localStorage.getItem("chatSessionId");
    if (!sid) {
      sid = "session-" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("chatSessionId", sid);
    }
    return sid;
  });

  const suggestions = [
    { label: "🏨 Suggest Hotels", value: "Recommend some good hotels in Jaipur" },
    { label: "🗺️ View Itinerary", value: "Show me the 3-day Delhi plan" },
    { label: "🚌 Bus Routes", value: "What are the bus routes for Agra?" },
  ];

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      // 🟢 Use API Client
      const response = await api.chat.sendMessage(input, sessionId); // Using persistent session ID

      const data = response.data; // Axios returns data in .data

      let botResponse = data.reply || data.response || "I received your message!";

      // Append list data if available (Hotels, Buses, Packages)
      if (data.data && Array.isArray(data.data)) {
        botResponse += "\n\n" + data.data.join("\n\n");
      }

      setMessages(prev => [...prev, {
        role: 'bot',
        text: botResponse
      }]);

    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, {
        role: 'bot',
        text: "Sorry, I'm having trouble connecting to the server right now."
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!user) return null;

  return (
    <div className="chatbot-wrapper">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            className="chat-window"
          >
            <div className="chat-header">
              <div className="flex items-center gap-2">
                <Bot size={20} />
                <span>Heritage Assistant</span>
              </div>
              <X className="cursor-pointer" onClick={() => setIsOpen(false)} />
            </div>

            <div className="messages-container">
              {messages.map((msg, i) => (
                <div key={i} className={`msg-bubble ${msg.role}`}>
                  {msg.text}
                </div>
              ))}

              {/* 🟢 Quick Action Chips */}
              {messages.length < 4 && ( // Only show at the start of conversation
                <div className="flex flex-wrap gap-2 mt-2">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      className="chat-chip"
                      onClick={() => {
                        setInput(s.value);
                        handleSendMessage(); // Auto-send when clicked
                      }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="chat-input-area">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about Jaipur, hotels..."
              />
              <button onClick={handleSendMessage}><Send size={18} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className="chat-toggle-btn"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X /> : <MessageCircle />}
      </motion.button>
    </div>
  );
};

export default Chatbot;