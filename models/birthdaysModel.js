// models/Birthday.js
const mongoose = require("mongoose");

const birthdaySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Link to the User model
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Birthday", birthdaySchema);
