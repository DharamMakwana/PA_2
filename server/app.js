const express = require("express");
const app = express();
const multer = require("multer");
const path = require("path");
const PORT = 8000;

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

app.post("/upload", upload.single("image"), (req, res) => {
  res.send("image uploaded");
});

app.listen(PORT, (err) => {
  if (err) console.log(err);

  console.log(`Server is listening on port ${PORT}`);
});
