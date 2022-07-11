const bcrypt = require('bcryptjs');
const { CustomCastError } = require('../classes/errors');
const { createToken } = require('../helpers/jwt');
const User = require('../models/user');
const { MESSAGES } = require('../utils/constants');

const formatUserData = ({
  name, about, avatar, email, _id,
}) => ({
  name, about, avatar, email, _id,
});

module.exports.getUsers = (req, res, next) => {
  User
    .find({})
    .then((users) => {
      if (!users) throw new CustomCastError(MESSAGES.userNotFound);
      res.send(users.map(formatUserData));
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      try {
        return User.create({
          name, about, avatar, email, password: hash,
        });
      } catch (err) { next(err); }
      return next();
    })
    .then((user) => {
      if (!user) throw new CustomCastError(MESSAGES.errorUserCreate);
      return res.send(formatUserData(user));
    })
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User
    .findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    )
    .then((user) => {
      if (!user) throw new CustomCastError(MESSAGES.userNotFound);
      res.send(formatUserData(user));
    })
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User
    .findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    )
    .then((user) => {
      if (!user) throw new CustomCastError(MESSAGES.userNotFound);
      res.send(formatUserData(user));
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User
    .findByCredentials(email, password)
    .then((user) => {
      if (!user) throw new CustomCastError(MESSAGES.userNotFound);
      const token = createToken({ _id: user._id });
      res
        .cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true })
        .send(formatUserData(user)).end();
    })
    .catch(next);
};

module.exports.getProfile = (req, res, next) => {
  User
    .findById(req.user._id)
    .then((user) => {
      if (!user) throw new CustomCastError(MESSAGES.userNotFound);
      res.send(formatUserData(user));
    })
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User
    .findById(req.params.userId)
    .then((user) => {
      if (!user) throw new CustomCastError(MESSAGES.userNotFound);
      res.send(formatUserData(user));
    })
    .catch(next);
};
