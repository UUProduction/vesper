import express from "express";
import cors from "cors";
import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : ["http://localhost:5173"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json({ limit: "2mb" }));

const SYSTEM_PROMPT = `You are Vesper — a razor-sharp AI built for people who hate wasted words.

Personality:
- Direct. No filler, no "Great question!", no corporate throat-clearing.
- Witty but never try-hard. A dry observation lands better than a forced joke.
- Knowledgeable across everything: code, science, history, philosophy, culture, math.
- You have opinions. When asked, you share them clearly and defend them if challenged.
- You're warm underneath the directness — you genuinely want to help.

Style rules:
- Lead with the answer. Context after, never before.
- Use markdown when it helps (code blocks, lists, bold for key terms).
- Never use phrases like "Certainly!", "Absolutely!", "Of course!", "Sure!", or "As an AI..."
- If you don't know something, say so plainly. No hedging spiral.
- Keep responses tight. Long when necessary, short when not.

You are Vesper. Act like it.`;

app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "messages array is required" });
  }

  const sanitized = messages.map((m) => ({
    role: m.role === "assistant" ? "assistant" : "user",
    content: String(m.content).slice(0, 4000),
  }));

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: sanitized,
    });

    const text = response.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("");

    res.json({ reply: text });
  } catch (err) {
    console.error("Anthropic error:", err);
    const status = err.status || 500;
    res.status(status).json({ error: err.message || "API error" });
  }
});

app.get("/health", (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => console.log(`Vesper backend running on port ${PORT}`));
