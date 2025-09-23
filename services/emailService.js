const nodemailer = require("nodemailer");

function createEmailTransporter() {
  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_PORT ||
    !process.env.SMTP_USER
  ) {
    console.warn(
      "⚠️ SMTP not configured. Email reminders will be skipped. " +
        "Set SMTP_HOST, SMTP_PORT, SMTP_USER in .env to enable."
    );
    return null;
  }

  try {
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS || undefined,
      },
    });

    console.log("✅ Email transporter configured successfully");
    return transporter;
  } catch (error) {
    console.error("❌ Failed to create email transporter:", error);
    return null;
  }
}

class EmailService {
  constructor() {
    this.transporter = createEmailTransporter();
  }

  async sendBirthdayReminder(birthday) {
    if (!this.transporter) {
      console.log("📧 Email not configured, skipping reminder");
      return Promise.resolve();
    }

    const to = birthday.email || process.env.OWNER_EMAIL;
    if (!to) {
      console.log("📧 No email address found for", birthday.name);
      return Promise.resolve();
    }

    const mailOptions = {
      from: process.env.FROM_EMAIL || process.env.SMTP_USER,
      to,
      subject: `🎂 Birthday reminder: ${birthday.name}`,
      html: `
        <h2>🎉 Birthday Reminder!</h2>
        <p>Today is <strong>${birthday.name}'s</strong> birthday!</p>
        <p>Date: ${new Date(birthday.date).toLocaleDateString()}</p>
        <p>Don't forget to celebrate! 🎂🎈</p>
      `,
      text: `Today is ${birthday.name}'s birthday (${birthday.date}). Don't forget to celebrate!`,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(
        `✅ Sent birthday reminder for ${birthday.name} - ${info.messageId}`
      );
      return info;
    } catch (error) {
      console.error(
        `❌ Failed to send reminder for ${birthday.name}:`,
        error.message
      );
      throw error;
    }
  }

  async sendTestEmail() {
    if (!this.transporter) {
      throw new Error("Email transporter not configured");
    }

    const testMail = {
      from: process.env.FROM_EMAIL || process.env.SMTP_USER,
      to: process.env.OWNER_EMAIL || process.env.SMTP_USER,
      subject: "Test Email from Birthday Reminder App",
      text: "This is a test email to verify email configuration.",
    };

    return await this.transporter.sendMail(testMail);
  }
}

module.exports = new EmailService();
