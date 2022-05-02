const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 8080;

require("dotenv").config();

const Schema = mongoose.Schema;

let wordsSchema = new Schema({
  words: Array,
});
try {
  mongoose
    .connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("connected to mongo db"));
} catch (error) {
  console.log("connection failed");
}

app.set("view engine", "ejs");
app.use((req, res, next) => {
  app.use(express.static(__dirname + "/public"));
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET");
  next();
});
app.get("/", async (req, res) => {
  let Words = mongoose.model("words", wordsSchema);
  const wordsQuery = Words.find();
  wordsQuery.find().then((data) => {
    res.status(200).render("index", {
      data: data[0].words,
    });
  });
});

app.listen(port);
