import React, { useState, useEffect } from "react";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const API_URL = "http://localhost:5000/api/messages"; // change when deployed

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    const res = await fetch(API_URL);
    const data = await res.json();
    setMessages(data);
  }

  async function sendMessage(e) {
    e.preventDefault();
    if (!input) return;
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: input })
    });
    setInput("");
    fetchMessages();
  }

  return (
    <div style={{ margin: "20px", fontFamily: "Arial" }}>
      <h1>Message Board</h1>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter a message"
          required
        />
        <button type="submit">Send</button>
      </form>
      <div style={{ marginTop: "20px" }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{ borderBottom: "1px solid #ccc", padding: "8px" }}>
            {msg.text}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
