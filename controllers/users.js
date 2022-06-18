const User = require("../models/user");
const { ERRORS, MESSAGES } = require("../utils/constants");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users.map(getUserData)))
    .catch((err) => catchErr(res, err, MESSAGES.userNotFound));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.send(getUserData(user)))
    .catch((err) => catchErr(res, err, MESSAGES.userNotFound));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send(getUserData(user)))
    .catch((err) => catchErr(res, err, MESSAGES.errorUserCreate));
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .then((user) => res.send(getUserData(user)))
    .catch((err) => catchErr(res, err, MESSAGES.errorProfileUpdate));
};
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true }
  )
    .then((user) => res.send(getUserData(user)))
    .catch((err) => catchErr(res, err, MESSAGES.errorAvatarUpdate));
};

const validation = (err, message = err.message) => {
  switch (err.name) {
    case "ValidationError":
      return new UserValidationError(message);
    case "CastError":
      return new UserCastError(message);
    default:
      return new ServerError(err.message);
  }
};

const catchErr = (res, err, msg) => {
  const { statusCode, message } = validation(err, msg);
  return res.status(statusCode).send({ message });
};

const getUserData = (user) => {
  if (user)
    return {
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id,
    };
  throw new UserCastError(MESSAGES.userNotFound);
};

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
