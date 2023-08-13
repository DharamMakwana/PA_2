// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  password: String,
  confirmPassword: String,
  profileImage: String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
