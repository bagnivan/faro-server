import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

const BITESHIP_API_KEY =
  process.env.BITESHIP_API_KEY || "68f88b0a638ffc001291dbe2";

app.get("/", (req, res) => {
  res.send("🚀 FARO Biteship Proxy Server is running!");
});

app.all("/api/biteship/*", async (req, res) => {
  try {
    const endpoint = req.params[0];
    const targetUrl = `https://api.biteship.com/v1/${endpoint}`;
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        Authorization: `Bearer ${BITESHIP_API_KEY}`,
        "Content-Type": "application/json",
      },
      body:
        req.method !== "GET" && req.method !== "HEAD"
          ? JSON.stringify(req.body)
          : null,
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error("Proxy Error:", error);
    res.status(500).json({ message: "Gagal terhubung ke Biteship API" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ FARO Server berjalan di port ${PORT}`);
});
