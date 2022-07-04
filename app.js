const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { MESSAGES } = require('./utils/constants');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use('/', auth, (req, res, next) => next());
app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((err, req, res, next) => {
  console.log('!!!', err);
  const { statusCode, message } = err;
  res.status(statusCode).send({ message });
  next();
});
app.use((req, res) => res.status(404).send({ message: MESSAGES.wrongPath }));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
