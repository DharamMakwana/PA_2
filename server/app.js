require("dotenv").config(); // Import the dotenv package and Load environment variables from .env file

const path = require("path");
const fs = require("fs").promises;

const express = require("express");
const app = express();
const PORT = 8000;

const mongoose = require("mongoose");
const User = require("./models/User"); // Import the User model

const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const fileName = Date.now() + path.extname(file.originalname);
    cb(null, fileName);
    req.filenameToBeUpated = fileName;
  },
});
const upload = multer({ storage: storage });

const startServer = async (app) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    app.listen(PORT, () => console.log("Server running on " + PORT));
  } catch (error) {
    console.log(error);
  }
};

app.use("/uploads", express.static("uploads"));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("upload");
});

app.get("/image/:id", (req, res) => {
  const imageId = req.params.id;
  res.render("image", { imageId });
});

app.get("/", (req, res) => {
  res.render("upload");
});

app.post("/upload", upload.single("image"), async (req, res) => {
  const { fname, lname, password, cpassword } = req.body;

  if (password !== cpassword)
    res.send("password do not match. please try again");

  const userObj = {
    firstName: fname,
    lastName: lname,
    password: password,
  };

  try {
    // Create a new user instance and Save the user instance to the database
    const newUser = await User.create(userObj);
    await updateFileName(
      req.filenameToBeUpated,
      `${newUser._id.toString()}.${req.filenameToBeUpated.split(".")[1]}`
    );
    res.redirect(`image/${newUser._id.toString()}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error uploading user data");
  }
});

startServer(app); // Start Server

const updateFileName = async (oldName, newName) => {
  try {
    await fs.rename(
      path.join("uploads/", oldName),
      path.join("uploads/", newName)
    );
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};
