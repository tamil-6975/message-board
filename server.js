const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

// --- Setup ---
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// --- MongoDB Connection ---
mongoose.connect("mongodb://localhost:27017/messageboard")
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));


// --- Define Schema & Model ---
const messageSchema = new mongoose.Schema({
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Message = mongoose.model("Message", messageSchema);

// --- API routes ---
app.get("/api/messages", async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

app.post("/api/messages", async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Message text required" });

  try {
    const newMessage = new Message({ text });
    await newMessage.save();
    res.json(newMessage);
  } catch (err) {
    res.status(500).json({ error: "Failed to save message" });
  }
});

// --- Serve React frontend build ---
app.use(express.static(path.join(__dirname, "public")));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// --- Start server ---
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
