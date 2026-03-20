import { readFileSync } from "node:fs";
import { join } from "node:path";

const db = JSON.parse(readFileSync(join(process.cwd(), "db.json"), "utf-8"));

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.status(200).json(db.leaderboard);
}
