const express = require("express");

const app = express();

app.get("potato", (req, res) => {
  res.set("Content-Type", "text/html");
  res.status(200).send("hi");
});

app.get("*", (req, res) => {
  res.set("Content-Type", "text/html");
  res.status(200).send(new Date());
});

module.exports = app;
