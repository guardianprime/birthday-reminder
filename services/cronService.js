const nodeCron = require("node-cron");
const Birthday = require("../models/birthdaysModel");
const emailService = require("./emailService");
const DateUtils = require("../dateUtils");

class CronService {
  constructor() {
    this.jobs = [];
  }

  async checkTodaysBirthdays() {
    try {
      console.log("Checking for today's birthdays...");

      // Get all birthdays from MongoDB
      const allBirthdays = await Birthday.find({});

      // Filter today's birthdays
      const todaysBirthdays = allBirthdays.filter((birthday) =>
        DateUtils.isBirthdayToday(birthday.date)
      );

      if (todaysBirthdays.length === 0) {
        console.log("No birthdays today");
        return;
      }

      console.log(
        `Birthdays today: ${todaysBirthdays.map((b) => b.name).join(", ")}`
      );

      // Send reminders for each birthday
      const emailPromises = todaysBirthdays.map((birthday) =>
        emailService.sendBirthdayReminder(birthday)
      );

      await Promise.allSettled(emailPromises);
    } catch (error) {
      console.error("Error checking today's birthdays:", error);
    }
  }

  startDailyBirthdayCheck() {
    // Run every day at 7:00 AM
    const job = nodeCron.schedule(
      "0 7 * * *",
      () => {
        this.checkTodaysBirthdays();
      },
      {
        scheduled: true,
        timezone: process.env.TIMEZONE || "UTC",
      }
    );

    this.jobs.push(job);
    console.log("Daily birthday check scheduled for 7:00 AM");

    return job;
  }

  //  Run a test check immediately
  runTestCheck() {
    console.log("Running test birthday check...");
    this.checkTodaysBirthdays();
  }

  stopAllJobs() {
    this.jobs.forEach((job) => job.stop());
    this.jobs = [];
    console.log("All cron jobs stopped");
  }
}

module.exports = new CronService();
