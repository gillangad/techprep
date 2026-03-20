const { readFileSync } = require("fs");
const { join } = require("path");

const db = JSON.parse(readFileSync(join(__dirname, "..", "..", "db.json"), "utf-8"));

module.exports = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const { id } = req.query;
  const detail = db["question-details"].find((q) => q.id === id);
  if (!detail) {
    return res.status(404).json({ error: "Not found" });
  }
  res.status(200).json(detail);
};
