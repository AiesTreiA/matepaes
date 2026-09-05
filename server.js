/**
 * server.js
 * Servidor Express para el videojuego "Manuel: Guardián del Álgebra" (1° Medio Chile)
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  generateExercise,
  verifyAnswer
} from './lib/algebraEngine.js';
import {
  CURRICULUM_INFO,
  WORLDS,
  CHEATSHEET,
  ACHIEVEMENTS
} from './lib/curriculumData.js';
import {
  getScores,
  addScore
} from './lib/scoreStore.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
}));

// ------------------------------------------------------------------
// API ENDPOINTS
// ------------------------------------------------------------------

// 1. Metadatos curriculares y narrativa
app.get('/api/curriculum', (req, res) => {
  res.json({
    curriculum: CURRICULUM_INFO,
    worlds: WORLDS,
    cheatsheet: CHEATSHEET,
    achievements: ACHIEVEMENTS
  });
});

// 2. Generador dinámico de ejercicios matemáticos
app.get('/api/exercise', (req, res) => {
  const topic = req.query.topic || 'cuadrado_binomio';
  const level = parseInt(req.query.level, 10) || 1;

  try {
    const exercise = generateExercise(topic, level);
    res.json(exercise);
  } catch (err) {
    console.error('Error generando ejercicio:', err);
    res.status(500).json({ error: 'Error al generar ejercicio matemático' });
  }
});

// 3. Verificación de respuesta con feedback pedagógico
app.post('/api/verify', (req, res) => {
  const { userAnswer, correctAnswer, numericAnswer } = req.body;

  if (userAnswer === undefined || correctAnswer === undefined) {
    return res.status(400).json({ error: 'Faltan datos para la verificación' });
  }

  const result = verifyAnswer(userAnswer, correctAnswer, numericAnswer);
  res.json(result);
});

// 4. Tabla de clasificación (Leaderboard)
app.get('/api/scores', (req, res) => {
  const scores = getScores();
  res.json(scores);
});

app.post('/api/scores', (req, res) => {
  const { player, score, world } = req.body;
  if (!player || typeof score !== 'number') {
    return res.status(400).json({ error: 'Datos de puntaje inválidos' });
  }
  const entry = addScore({ player, score, world });
  res.json({ success: true, entry, allScores: getScores() });
});

// Iniciar servidor localmente (en Vercel se usa como Serverless Function)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🎮 Manuel: Guardián del Álgebra (1° Medio Chile) ejecutándose en http://localhost:${PORT}`);
  });
}

export default app;
