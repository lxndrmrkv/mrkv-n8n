import express from "express";
import crypto from "crypto";
import fetch from "node-fetch"; // ✅ добавлено, чтобы получать внешний IP

const app = express();
app.use(express.json());

// ✅ Эндпоинт для подписи
app.post("/sign", (req, res) => {
  try {
    const { payload, secret } = req.body;

    if (!payload || !secret) {
      return res.status(400).json({ error: "Missing payload or secret" });
    }

    // Генерация подписи
    const sign = crypto.createHmac("sha256", secret).update(payload).digest("hex");

    return res.json({ sign });
  } catch (err) {
    console.error("Sign error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Проверка статуса
app.get("/", (_, res) => res.send("✅ Bybit Signer is running"));

// ✅ Новый эндпоинт для получения внешнего IP Railway
app.get("/ip", async (req, res) => {
  try {
    const ip = await fetch("https://ifconfig.me/ip").then(r => r.text());
    res.send(`Your external IP: ${ip}`);
  } catch (err) {
    console.error("IP fetch error:", err);
    res.status(500).send("Unable to fetch IP");
  }
});

// 🚀 Запуск
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Signer running on port ${PORT}`));
