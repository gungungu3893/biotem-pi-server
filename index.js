import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

/**
 * =========================
 * Pi 설정
 * =========================
 * ⚠️ 실제 Pi App의 API Key
 */
const PI_API_KEY = "여기에_너의_PI_API_KEY_그대로";
const PI_API_URL = "https://api.minepi.com";

/**
 * =========================
 * Health Check
 * =========================
 */
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    time: new Date().toISOString(),
  });
});

/**
 * =========================
 * 1️⃣ 결제 승인 (approve)
 * =========================
 */
app.post("/approve", async (req, res) => {
  const { paymentId } = req.body;
  console.log("▶ /approve called:", paymentId);

  if (!paymentId) {
    return res.status(400).json({ error: "paymentId missing" });
  }

  try {
    const response = await fetch(
      `${PI_API_URL}/v2/payments/${paymentId}/approve`,
      {
        method: "POST",
        headers: {
          Authorization: `Key ${PI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    console.log("✅ approve response:", data);

    res.json({ success: true, data });
  } catch (err) {
    console.error("❌ approve error:", err);
    res.status(500).json({ success: false });
  }
});

/**
 * =========================
 * 2️⃣ 결제 완료 (complete)
 * =========================
 */
app.post("/complete", async (req, res) => {
  const { paymentId, txid } = req.body;
  console.log("▶ /complete called:", paymentId, txid);

  if (!paymentId || !txid) {
    return res.status(400).json({ error: "paymentId or txid missing" });
  }

  try {
    const response = await fetch(
      `${PI_API_URL}/v2/payments/${paymentId}/complete`,
      {
        method: "POST",
        headers: {
          Authorization: `Key ${PI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ txid }),
      }
    );

    const data = await response.json();
    console.log("✅ complete response:", data);

    res.json({ success: true, data });
  } catch (err) {
    console.error("❌ complete error:", err);
    res.status(500).json({ success: false });
  }
});

/**
 * =========================
 * Render 포트
 * =========================
 */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Pi server running on port ${PORT}`);
});
