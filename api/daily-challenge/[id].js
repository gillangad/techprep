import db from "../../db.json" assert { type: "json" };

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const { id } = req.query;
  const challenge = db["daily-challenge"].find((c) => c.id === id);
  if (!challenge) {
    return res.status(404).json({ error: "Not found" });
  }
  res.status(200).json(challenge);
}
