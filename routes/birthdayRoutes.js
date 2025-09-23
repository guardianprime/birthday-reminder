const birthdayRoutes = require("express").Router();
const mongoose = require("mongoose");
const Birthday = require("../models/birthdaysModel");

birthdayRoutes.get("/add", (req, res) => {
  console.log("Rendering add birthday form");
  res.render("add");
});

birthdayRoutes.post("/add", async (req, res) => {
  try {
    const { name, date, email } = req.body;

    if (!name || !date) {
      return res.status(400).render("add", {
        error: "Name and date are required",
        formData: { name, date, email },
      });
    }

    const birthday = new Birthday({
      name: name.trim(),
      date: new Date(date),
      email: email ? email.trim() : undefined,
    });

    await birthday.save();

    console.log(`Birthday saved: ${name} - ${date}`);
    res.redirect("/?success=Birthday added successfully");
  } catch (error) {
    console.error("Error saving birthday:", error);

    if (error.name === "ValidationError") {
      const errorMessages = Object.values(error.errors).map(
        (err) => err.message
      );
      return res.status(400).render("add", {
        error: errorMessages.join(", "),
        formData: req.body,
      });
    }

    res.status(500).render("add", {
      error: "An error occurred while saving the birthday.",
      formData: req.body,
    });
  }
});

// Get all birthdays
birthdayRoutes.get("/", async (req, res) => {
  try {
    const birthdays = await Birthday.find({}).sort({ date: 1 });

    console.log(`Found ${birthdays.length} birthdays`);

    res.render("index", {
      birthdays,
      success: req.query.success,
      error: req.query.error,
    });
  } catch (error) {
    console.error("Error fetching birthdays:", error);
    res.status(500).render("index", {
      error: "Failed to load birthdays",
      birthdays: [],
    });
  }
});

birthdayRoutes.post("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).redirect("/?error=Invalid birthday ID");
    }

    const deletedBirthday = await Birthday.findByIdAndDelete(id);

    if (!deletedBirthday) {
      return res.status(404).redirect("/?error=Birthday not found");
    }

    console.log(` Deleted birthday: ${deletedBirthday.name}`);
    res.redirect("/?success=Birthday deleted successfully");
  } catch (error) {
    console.error(" Error deleting birthday:", error);
    res.status(500).redirect("/?error=Failed to delete birthday");
  }
});

module.exports = birthdayRoutes;
