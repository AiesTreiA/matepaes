/**
 * scoreStore.js
 * Almacenamiento local de puntajes, partidas y logros
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');
const SCORES_FILE = path.join(DATA_DIR, 'scores.json');

// Memoria inicial
let memoryScores = [
  { player: "Manuel", score: 2450, world: 5, date: "2026-09-01", medal: "Oro" },
  { player: "Sofía (1°A)", score: 2100, world: 5, date: "2026-09-02", medal: "Plata" },
  { player: "Matías (1°B)", score: 1850, world: 4, date: "2026-09-03", medal: "Bronce" },
  { player: "Valentina (1°C)", score: 1600, world: 4, date: "2026-09-04", medal: "Bronce" }
];

function ensureDataFile() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(SCORES_FILE)) {
      fs.writeFileSync(SCORES_FILE, JSON.stringify(memoryScores, null, 2), 'utf-8');
    } else {
      const raw = fs.readFileSync(SCORES_FILE, 'utf-8');
      memoryScores = JSON.parse(raw);
    }
  } catch (err) {
    console.warn("Aviso: usando almacenamiento en memoria para puntajes.", err.message);
  }
}

export function getScores() {
  ensureDataFile();
  return memoryScores.sort((a, b) => b.score - a.score).slice(0, 15);
}

export function addScore(entry) {
  ensureDataFile();
  const newEntry = {
    player: (entry.player || "Manuel").substring(0, 25),
    score: Number(entry.score) || 0,
    world: Number(entry.world) || 1,
    date: new Date().toISOString().split('T')[0],
    medal: entry.score >= 2000 ? "Oro" : entry.score >= 1200 ? "Plata" : "Bronce"
  };

  memoryScores.push(newEntry);
  memoryScores.sort((a, b) => b.score - a.score);

  try {
    if (fs.existsSync(DATA_DIR)) {
      fs.writeFileSync(SCORES_FILE, JSON.stringify(memoryScores, null, 2), 'utf-8');
    }
  } catch (err) {
    console.warn("Aviso al guardar archivo de puntajes:", err.message);
  }

  return newEntry;
}
