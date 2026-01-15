import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// Pi App 설정
const PI_API_KEY = "여기에_네_PI_API_KEY";
const PI_API_URL = "https://api.minepi.com";

// Render에서 사용하는 포트
const PORT = process.env.PORT || 3000;

/**
 * 1️⃣ 결제 승인 (approve)
 */
app.post("/approve", async (req, res) => {
  const { paymentId } = req.body;

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
    res.json({ success: true, data });
  } catch (err) {
    console.error("Approve error:", err);
    res.status(500).json({ success: false });
  }
});

/**
 * 2️⃣ 결제 완료 (complete)
 */
app.post("/complete", async (req, res) => {
  const { paymentId, txid } = req.body;

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
    res.json({ success: true, data });
  } catch (err) {
    console.error("Complete error:", err);
    res.status(500).json({ success: false });
  }
});

app.get("/", (req, res) => {
  res.send("BIOTEM Pi Server is running");
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
