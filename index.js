import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const PI_API_KEY = process.env.PI_API_KEY;

// 서버 상태 확인
app.get("/", (req, res) => {
  res.send("BIOTEM Pi Server is running");
});

// 1️⃣ 결제 승인
app.post("/approve", async (req, res) => {
  const { paymentId } = req.body;

  try {
    const response = await fetch(
      `https://api.minepi.com/v2/payments/${paymentId}/approve`,
      {
        method: "POST",
        headers: {
          Authorization: `Key ${PI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2️⃣ 결제 완료
app.post("/complete", async (req, res) => {
  const { paymentId, txid } = req.body;

  try {
    const response = await fetch(
      `https://api.minepi.com/v2/payments/${paymentId}/complete`,
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
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on", PORT));
