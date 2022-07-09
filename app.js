const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const auth = require('./middlewares/auth');
const { MESSAGES } = require('./utils/constants');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use('/', auth, (req, res, next) => next());

app.use('/users', auth, require('./routes/users'));
app.use('/cards', auth, require('./routes/cards'));

app.use(errors());
app.use((req, res) => res.status(404).send({ message: MESSAGES.wrongPath }));
app.use((err, req, res, next) => {
  const { statusCode, message } = err;
  // if (isCelebrateError(err)) {
  //   const errorBody = err.details.get('body');
  //   const { details: [errorDetails] } = errorBody;
  //   statusCode = ERRORS.UNAUTHORIZED;
  //   message = errorDetails.message;
  // }
  res.status(statusCode).send({ message });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
