import db from "../db.json" assert { type: "json" };

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const data = db["daily-challenge"];
  const dayIndex = new Date().getDate() % data.length;
  res.status(200).json(data[dayIndex]);
}
