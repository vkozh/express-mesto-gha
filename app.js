const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors, isCelebrateError } = require('celebrate');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { MESSAGES, ERRORS } = require('./utils/constants');

// const regexp = /https?\\:\/\/(w{3}\.)?\S+\.\w+(\/\S+)*\\#?/g;

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use('/', auth, (req, res, next) => next());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);
app.post('/signup', celebrate(
  {
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().pattern(/https?:\/\/(w{3}\.)?\S+\.\w+(\/\S+)*#?/),
    }),
  },
), createUser);
// app.use(errors());
app.use('/users', auth, require('./routes/users'));
app.use('/cards', auth, require('./routes/cards'));

app.use((req, res) => res.status(404).send({ message: MESSAGES.wrongPath }));
app.use((err, req, res, next) => {
  if (isCelebrateError(err)) {
    const body = err.details.get('body');
    res.status(ERRORS.UNAUTHORIZED).send({ message: body.message });
  }
  const { statusCode, message } = err;
  res.status(statusCode).send({ message });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
