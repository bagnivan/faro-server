import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;
const BITESHIP_API_KEY = process.env.BITESHIP_API_KEY;

app.use(cors());
app.use(express.json());

// ✅ FIXED: Tidak pakai wildcard — Express 5 compatible
app.use("/api/biteship", async (req, res) => {
  try {
    // Ambil path setelah "/api/biteship/"
    const path = req.originalUrl.replace("/api/biteship/", "");
    const url = `https://api.biteship.com/v1/${path}`;

    const response = await fetch(url, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        Authorization: BITESHIP_API_KEY,
      },
      body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error("Proxy Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Test route
app.get("/", (req, res) => {
  res.send("🚀 FARO Biteship Proxy Server is running! (Express v5 FIXED)");
});

app.listen(PORT, () => {
  console.log(`✅ Server jalan di port ${PORT}`);
});
