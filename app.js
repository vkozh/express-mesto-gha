const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const {
  celebrate, Joi, errors,
} = require('celebrate');
const {
  UserCastError, UserValidationError, ConflictError, AuthError,
} = require('./classes/errors');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { MESSAGES, ERRORS } = require('./utils/constants');

const { PORT = 3000 } = process.env;
const app = express();

const validation = (err, message = err.message) => {
  switch (err.name) {
    case 'ValidationError':
      return new UserValidationError(message);
    case 'CastError':
      return err.code === 404
        ? new UserCastError(message)
        : new UserValidationError(message);
    case 'MongoServerError':
      return new ConflictError(MESSAGES.alreadyExist);
    case 'TypeError':
      return new AuthError(message);
    default:
      return new Error(message);
  }
};

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use('/', auth, (req, res, next) => next());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
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

app.use('/users', auth, require('./routes/users'));
app.use('/cards', auth, require('./routes/cards'));

// app.use((req, res) => res.status(404).send({ message: MESSAGES.wrongPath }));
app.use((req, res, next) => {
  const err = new Error(MESSAGES.wrongPath);
  err.statusCode = ERRORS.NOT_FOUND;
  next(err);
});
app.use(errors());
app.use((err, req, res, next) => {
  let { statusCode, message } = err;
  if (!statusCode) {
    const customErr = validation(err);
    statusCode = customErr.statusCode;
    message = customErr.message;
  }

  res.status(statusCode).send({ message });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
