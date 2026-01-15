import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

/**
 * Pi 서버 검증용 키
 * (나중에 Render 환경변수로 이동할 예정)
 */
const PI_API_KEY = process.env.PI_API_KEY || "DEV_MODE";

/* ---------------- 기본 설정 ---------------- */
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("BIOTEM Pi Server is running");
});

/* ---------------- Pi 결제 승인 단계 ---------------- */
/**
 * Pi SDK 흐름상
 * 1. 클라이언트에서 createPayment
 * 2. onReadyForServerApproval → 여기 호출
 */
app.post("/approve", async (req, res) => {
  const { paymentId } = req.body;

  console.log("🔵 승인 요청 수신:", paymentId);

  // 지금은 실제 Pi 서버 승인 없이 OK만 반환
  return res.json({
    success: true,
    paymentId,
    message: "Server approval OK (test mode)",
  });
});

/**
 * 3. Pi 서버에서 결제 완료 통보 → 여기서 최종 완료
 */
app.post("/complete", async (req, res) => {
  const { paymentId, txid } = req.body;

  console.log("🟢 결제 완료:", paymentId, txid);

  return res.json({
    success: true,
    paymentId,
    txid,
  });
});

/* ---------------- 서버 시작 ---------------- */
app.listen(PORT, () => {
  console.log(`🚀 BIOTEM Pi Server running on port ${PORT}`);
});
