import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Pastikan kamu punya API Key di Render Environment
const BITESHIP_API_KEY = process.env.BITESHIP_API_KEY || "68f88b0a638ffc001291dbe2";

// Proxy untuk semua request ke Biteship API
app.all("/api/biteship/*", async (req, res) => {
  try {
    const targetUrl = `https://api.biteship.com/v1/${req.params[0]}`;

    const options = {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        Authorization: BITESHIP_API_KEY,
      },
    };

    if (req.method !== "GET" && req.body) {
      options.body = JSON.stringify(req.body);
    }

    const response = await fetch(targetUrl, options);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error("Biteship proxy error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error (Proxy Biteship)",
    });
  }
});

// Default route (buat testing aja)
app.get("/", (req, res) => {
  res.json({ message: "✅ FARO Server is running!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
