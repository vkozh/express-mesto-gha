/* eslint max-classes-per-file: ['error', 4] */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { ERRORS, MESSAGES } = require('../utils/constants');

const formatUserData = ({
  name, about, avatar, email,
  // _id,
}) => ({
  name,
  about,
  avatar,
  email,
  // _id,
});

class UserCastError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UserCastError';
    this.statusCode = ERRORS.NOT_FOUND;
  }
}

class UserValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UserValidationError';
    this.statusCode = ERRORS.UNCORRECT;
  }
}

class ServerError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ServerError';
    this.statusCode = ERRORS.SERVER_ERR;
  }
}

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConflictError';
    this.statusCode = ERRORS.CONFLICT;
  }
}

const validation = (err, message = err.message) => {
  if (err.code === 11000) return new ConflictError(MESSAGES.alreadyExist);
  switch (err.name) {
    case 'ValidationError':
      return new UserValidationError(message);
    case 'CastError':
      return err.code === 404
        ? new UserCastError(message)
        : new UserValidationError(message);
    default:
      return new ServerError(message);
  }
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      if (!users) next(new UserCastError(MESSAGES.userNotFound));
      res.send(users.map(formatUserData));
    })
    .catch((err) => next(validation(err, MESSAGES.userNotFound)));
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    User.init().then(async () => {
      // try {
      await User.create({
        name, about, avatar, email, password: hash,
      })
        .then((user) => {
          if (!user) next(new UserCastError(MESSAGES.userNotFound));
          res.send(formatUserData(user));
        })
        .catch((err) => next(validation(err, MESSAGES.errorUserCreate)));
      // } catch (error) {
      //   if (error.code === 11000) res.status(409).send();
      //   next(error);
      // }
    }).catch((err) => next(validation(err, MESSAGES.errorUserCreate)));
  });
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) next(new UserCastError(MESSAGES.userNotFound));
      res.send(formatUserData(user));
    })
    .catch((err) => next(validation(err, MESSAGES.errorProfileUpdate)));
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) next(new UserCastError(MESSAGES.userNotFound));
      res.send(formatUserData(user));
    })
    .catch((err) => next(validation(err, MESSAGES.errorAvatarUpdate)));
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findByCredentials(email, password)
    .then((user) => {
      if (!user) next(new UserCastError(MESSAGES.userNotFound));
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true }).end();
    })
    .catch((err) => next(validation(err, MESSAGES.wrongUserData)));
};

module.exports.getProfile = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) next(new UserCastError(MESSAGES.userNotFound));
      res.send(formatUserData(user));
    })
    .catch((err) => next(validation(err, MESSAGES.userNotFound)));
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) next(new UserCastError(MESSAGES.userNotFound));
      res.send(formatUserData(user));
    })
    .catch((err) => next(validation(err, MESSAGES.userNotFound)));
};
