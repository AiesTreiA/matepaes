import { verifyAnswer } from "../lib/algebraEngine.js";

export default function handler(req, res) {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }
  const { userAnswer, correctAnswer, numericAnswer } = req.body || {};
  const result = verifyAnswer(userAnswer, correctAnswer, numericAnswer);
  res.status(200).json(result);
}
