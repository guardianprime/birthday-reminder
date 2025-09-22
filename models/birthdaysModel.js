// models/Birthday.js
const mongoose = require("mongoose");

const birthdaySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Link to the User model
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Birthday", birthdaySchema);
