const { json } = require("body-parser");
const User = require("../models/user");
const { ERRORS, MESSAGES } = require("../utils/constants");

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      if (!user) next(new UserCastError(MESSAGES.userNotFound));
      res.send(users.map(formatUserData));
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

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      if (!user) next(new UserCastError(MESSAGES.userNotFound));
      res.send(formatUserData(user));
    })
    .catch((err) => next(validation(err, MESSAGES.errorUserCreate)));
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
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
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) next(new UserCastError(MESSAGES.userNotFound));
      res.send(formatUserData(user));
    })
    .catch((err) => next(validation(err, MESSAGES.errorAvatarUpdate)));
};

const validation = (err, message = err.message) => {
  switch (err.name) {
    case "ValidationError":
      return new UserValidationError(message);
    case "CastError":
      return err.code === 404
        ? new UserCastError(message)
        : new UserValidationError(message);
    default:
      return new ServerError(message);
  }
};

const formatUserData = ({ name, about, avatar, _id }) => ({
  name,
  about,
  avatar,
  _id,
});

class UserCastError extends Error {
  constructor(message) {
    super(message);
    this.name = "UserCastError";
    this.statusCode = ERRORS.NOT_FOUND;
  }
}

class UserValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "UserValidationError";
    this.statusCode = ERRORS.UNCORRECT;
  }
}

class ServerError extends Error {
  constructor(message) {
    super(message);
    this.name = "ServerError";
    this.statusCode = ERRORS.SERVER_ERR;
  }
}
