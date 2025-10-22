import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Ambil API Key dari Render Environment atau fallback ke key default
const BITESHIP_API_KEY = process.env.BITESHIP_API_KEY || "68f88b0a638ffc001291dbe2";

// ✅ Route proxy Biteship (versi paling stabil)
app.all(/^\/api\/biteship\/(.*)/, async (req, res) => {
  try {
    const path = req.params[0]; // ambil path setelah /api/biteship/
    const targetUrl = `https://api.biteship.com/v1/${path}`;

    const options = {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        Authorization: BITESHIP_API_KEY,
      },
    };

    if (req.method !== "GET" && req.body && Object.keys(req.body).length > 0) {
      options.body = JSON.stringify(req.body);
    }

    const response = await fetch(targetUrl, options);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error("Proxy Biteship error:", error);
    res.status(500).json({ success: false, message: "Proxy Error", error: error.message });
  }
});

// Default test route
app.get("/", (req, res) => {
  res.json({ message: "✅ FARO server is running!" });
});

// Jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
