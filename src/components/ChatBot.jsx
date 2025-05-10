// Updated ChatBot.jsx with Voice Output and Hinglish/English Switch

import React, { useState, useEffect } from "react";
import "../assets/style.css";

function ChatBot() {
  const [question, setQuestion] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [voiceLang, setVoiceLang] = useState("hinglish");

  useEffect(() => {
    // Load voices once
    window.speechSynthesis.getVoices();
  }, []);

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();

    const preferredVoice = voices.find(voice => {
      if (voiceLang === "hinglish") {
        return voice.lang === "en-IN"; // Indian English
      } else {
        return voice.lang === "en-US" || voice.lang === "en-GB";
      }
    });

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const newChat = [...chat, { role: "user", text: question }];
    setChat(newChat);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5050/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question }),
      });

      const data = await res.json();
      setChat([...newChat, { role: "bot", text: data.reply }]);
      speak(data.reply);
    } catch (err) {
        console.error("Chatbot error:", err);
      setChat([...newChat, { role: "bot", text: "⚠️ Error getting response!" }]);

    }

    setQuestion("");
    setLoading(false);
  };

  return (
    <div className="card">
      <h2 className="section-title">🤖 Ask OSBot</h2>

      <div style={{ marginBottom: "10px", textAlign: "right" }}>
        <label style={{ fontWeight: "bold", marginRight: "10px" }}>Voice:</label>
        <select
          className="dropdown"
          value={voiceLang}
          onChange={(e) => setVoiceLang(e.target.value)}
        >
          <option value="hinglish">Hinglish (Indian English)</option>
          <option value="english">English (UK/US)</option>
        </select>
      </div>

      <div className="chat-box">
        {chat.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.role}`}>
            <strong>{msg.role === "user" ? "You" : "OSBot"}:</strong> {msg.text}
          </div>
        ))}
        {loading && <p>⏳ Thinking...</p>}
      </div>

      <form className="chat-form" onSubmit={handleAsk}>
        <input
          className="input"
          type="text"
          placeholder="Ask anything about scheduling..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button className="btn primary" type="submit">Ask</button>
      </form>
    </div>
  );
}

export default ChatBot;