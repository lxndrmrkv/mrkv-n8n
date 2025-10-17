import express from "express";
import crypto from "crypto";

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

// 🚀 Запуск
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Signer running on port ${PORT}`));
