const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const dotenv = require("dotenv"); // Import the dotenv package
const path = require("path");
const app = express();
const PORT = 8000;
const { MongoClient } = require("mongodb");

dotenv.config(); // Load environment variables from .env file


const User = require("./models/User"); // Import the User model

// MongoDB connection setup
mongoose.connect(process.env.MONGODBURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

app.set("view engine", "ejs");

app.get("/upload", (req, res) => {
  res.render("upload");
});

app.post("/upload", upload.single("image"), async (req, res) => {
  const { fname, lname, password, cpassword } = req.body;
  const profileImage = req.file ? req.file.filename : null;

  // Create a new user instance
  const newUser = new User({
    firstName: fname,
    lastName: lname,
    password: password,
    confirmPassword: cpassword,
    profileImage: profileImage,
  });

  try {
    // Save the user instance to the database
    await newUser.save();
    res.send("User data and image uploaded");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error uploading user data");
  }
});

app.listen(PORT, (err) => {
  if (err) console.log(err);

  console.log(`Server is listening on port ${PORT}`);
});
