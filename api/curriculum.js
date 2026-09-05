import { CURRICULUM_INFO, WORLDS, CHEATSHEET, ACHIEVEMENTS } from "../lib/curriculumData.js";

export default function handler(req, res) {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.status(200).json({
    curriculum: CURRICULUM_INFO,
    worlds: WORLDS,
    cheatsheet: CHEATSHEET,
    achievements: ACHIEVEMENTS
  });
}
