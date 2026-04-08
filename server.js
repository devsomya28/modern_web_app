import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("🚀 Server is running!");
});

app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    console.log("Incoming messages:", messages);

    // ✅ Convert messages to OpenAI format
 const formattedMessages = messages.map((msg) => ({
  role: msg.role,
  content: msg.content,
}));

    const response = await axios.post(
  "https://api.groq.com/openai/v1/chat/completions",
  {
   model: "llama-3.1-8b-instant",
    messages: formattedMessages,
    temperature: 0.7,
  },
  {
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
  }
);

console.log("Groq response:", response.data);

    const reply =
      response.data.choices?.[0]?.message?.content ||
      "No response from AI";

    res.json({ reply });
  } catch (err) {
    console.error("❌ ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: "API error" });
  }
});

app.listen(5000, () => {
  console.log("🚀 Groq server running on http://localhost:5000");
});
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve frontend
app.use(express.static(path.join(__dirname, "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});