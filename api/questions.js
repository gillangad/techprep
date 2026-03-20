const { readFileSync } = require("fs");
const { join } = require("path");

const db = JSON.parse(readFileSync(join(__dirname, "..", "db.json"), "utf-8"));

module.exports = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.status(200).json(db.questions);
};
