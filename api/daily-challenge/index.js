const { readFileSync } = require("fs");
const { join } = require("path");

const db = JSON.parse(readFileSync(join(__dirname, "..", "..", "db.json"), "utf-8"));

module.exports = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const data = db["daily-challenge"];
  const dayIndex = new Date().getDate() % data.length;
  res.status(200).json(data[dayIndex]);
};
