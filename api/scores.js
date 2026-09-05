import { getScores, addScore } from "../lib/scoreStore.js";

export default function handler(req, res) {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "POST") {
    const { player, score, world } = req.body || {};
    const updated = addScore({ player, score, world });
    return res.status(201).json(updated);
  }
  res.status(200).json(getScores());
}
