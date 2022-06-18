const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const user = require("./models/user");

const { PORT = 3000 } = process.env;

mongoose.connect("mongodb://localhost:27017/mestodb");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", (req, res, next) => {
  req.user = {
    _id: "62ac9d0ed557e84d70fc73d6",
  };
  next();
});
app.use("/users", require("./routes/users"));
app.use("/cards", require("./routes/cards"));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
