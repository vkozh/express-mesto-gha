const express = require("express");
const mongoose = require("mongoose");
// const router = require("./routes/routes");
const bodyParser = require("body-parser");
const user = require("./models/user");

const { PORT = 3000 } = process.env;

mongoose.connect("mongodb://localhost:27017/mestodb", {
  // useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
});

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", (req, res, next) => {
  req.user = {
    _id: "62aa3a2dfaf32a08b0ae2749",
  };
  next();
});
// app.use("/", router);
app.use("/users", require("./routes/users"));
app.use("/cards", require("./routes/cards"));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
