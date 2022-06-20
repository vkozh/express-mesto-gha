const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { MESSAGES } = require('./utils/constants');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', (req, res, next) => {
  req.user = {
    _id: '62af1ff7806aa9863a01473f',
  };
  next();
});
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((err, req, res) => {
  const { statusCode, message } = err;
  res.status(statusCode).send({ message });
});
app.use((req, res) => res.status(404).send({ message: MESSAGES.wrongPath }));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
