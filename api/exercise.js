import { generateExercise } from "../lib/algebraEngine.js";

export default function handler(req, res) {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
  res.setHeader("Access-Control-Allow-Origin", "*");
  const topic = req.query?.topic || "cuadrado_binomio";
  const level = parseInt(req.query?.level, 10) || 1;

  try {
    const exercise = generateExercise(topic, level);
    res.status(200).json(exercise);
  } catch (err) {
    res.status(500).json({ error: "Error al generar ejercicio", details: err.message });
  }
}
