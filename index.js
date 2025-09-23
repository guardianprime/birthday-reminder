const express = require("express");
const dotenv = require("dotenv");
const nodeCron = require("node-cron");
const nodemailer = require("nodemailer");
const { connectToMongoDB } = require("./db");

dotenv.config();
connectToMongoDB();

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use("/auth", require("./routes/authRoutes"));
app.use("/birthday", require("./routes/birthdayRoutes"));

app.get("/", (req, res) => {
  res.render("homepage");
});

app.get("/index", (req, res) => {
  res.render("index");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
