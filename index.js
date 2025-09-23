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

// Setup email transporter if SMTP variables exist
let transporter = null;
if (process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS || undefined,
    },
  });
} else {
  console.warn(
    "SMTP not configured. Email reminders will be skipped. Set SMTP_HOST, SMTP_PORT, SMTP_USER in .env to enable."
  );
}

function sendReminder(birthday) {
  if (!transporter) return Promise.resolve();
  const to = birthday.email || process.env.OWNER_EMAIL;
  if (!to) return Promise.resolve();
  const mail = {
    from: process.env.FROM_EMAIL || process.env.SMTP_USER,
    to,
    subject: `Birthday reminder: ${birthday.name}`,
    text: `Today is ${birthday.name}'s birthday (${birthday.date}). Don't forget to celebrate!`,
  };
  return transporter
    .sendMail(mail)
    .then((info) =>
      console.log("Sent reminder for", birthday.name, info.messageId)
    )
    .catch((err) => console.error("Failed to send reminder", err));
}

// Cron job: run every day at 07:00
nodeCron.schedule("0 7 * * *", () => {
  const list = readBirthdays();
  const today = new Date();
  const mmdd = `${String(today.getMonth() + 1).padStart(2, "0")}-${String(
    today.getDate()
  ).padStart(2, "0")}`;
  const todays = list.filter((b) => {
    const d = new Date(b.date);
    if (isNaN(d)) return false;
    return (
      `${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate()
      ).padStart(2, "0")}` === mmdd
    );
  });
  if (todays.length) {
    console.log("Birthdays today:", todays.map((t) => t.name).join(", "));
    todays.forEach(sendReminder);
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
