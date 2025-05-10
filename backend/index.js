import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { OpenAI } from "openai";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/ask", async (req, res) => {
  const { message } = req.body;
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  }catch (err) {
    console.error("❌ Error in OpenAI API:", err);
    res.status(500).json({ error: "OpenAI API Error", details: err.message });
  }
});

const PORT = 5050; // or any other free port
app.listen(PORT, () => {
  console.log(`Chatbot backend running on http://localhost:${PORT}`);
});
