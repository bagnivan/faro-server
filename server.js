import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 10000;
const BITESHIP_API_KEY = process.env.BITESHIP_API_KEY;

app.use(cors());
app.use(express.json());

// ✅ Route universal proxy Biteship (FIXED)
app.all("/api/biteship/:path(*)", async (req, res) => {
  const { path } = req.params;
  const url = `https://api.biteship.com/v1/${path}`;

  try {
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

app.get("/", (req, res) => {
  res.send("🚀 FARO Biteship Proxy Server is running!");
});

app.listen(PORT, () => {
  console.log(`✅ Server jalan di port ${PORT}`);
});
