const bcrypt = require('bcryptjs');
const { UserCastError } = require('../classes/errors');
const { createToken } = require('../helpers/jwt');
const User = require('../models/user');
const { MESSAGES } = require('../utils/constants');

const formatUserData = ({
  name, about, avatar, email, _id,
}) => ({
  name, about, avatar, email, _id,
});

// const validation = (err, message = err.message) => {
//   switch (err.name) {
//     case 'ValidationError':
//       return new UserValidationError(message);
//     case 'CastError':
//       return err.code === 404
//         ? new UserCastError(message)
//         : new UserValidationError(message);
//     case 'MongoServerError':
//       return new ConflictError(MESSAGES.alreadyExist);
//     case 'TypeError':
//       return new AuthError(message);
//     default:
//       return new Error(message);
//   }
// };

module.exports.getUsers = (req, res, next) => {
  User
    .find({})
    .then((users) => {
      if (!users) throw new UserCastError(MESSAGES.userNotFound);
      res.send(users.map(formatUserData));
    })
    .catch(next);
  // .catch((err) => next(validation(err, MESSAGES.userNotFound)));
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      User
        .init()
        .then(() => {
          try {
            return User.create({
              name, about, avatar, email, password: hash,
            });
          } catch (err) { next(err); }
          return next();
          // { return next(validation(err, MESSAGES.errorUserCreate)); }
        })
        .then((user) => {
          if (!user) throw new UserCastError(MESSAGES.userNotFound);
          return res.send(formatUserData(user));
        })
        .catch(next);
      // .catch((err) => next(validation(err, MESSAGES.errorUserCreate)));
    });
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
      if (!user) throw new UserCastError(MESSAGES.userNotFound);
      res.send(formatUserData(user));
    })
    .catch(next);
  // .catch((err) => next(validation(err, MESSAGES.errorProfileUpdate)));
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
      if (!user) throw new UserCastError(MESSAGES.userNotFound);
      res.send(formatUserData(user));
    })
    .catch(next);
  // .catch((err) => next(validation(err, MESSAGES.errorAvatarUpdate)));
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User
    .findByCredentials(email, password)
    .then((user) => {
      if (!user) throw new UserCastError(MESSAGES.userNotFound);
      const token = createToken({ _id: user._id });
      res
        .cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true })
        .send(formatUserData(user)).end();
    })
    .catch(next);
  // .catch((err) => next(validation(err, MESSAGES.wrongUserData)));
};

module.exports.getProfile = (req, res, next) => {
  User
    .findById(req.user._id)
    .then((user) => {
      if (!user) throw new UserCastError(MESSAGES.userNotFound);
      res.send(formatUserData(user));
    })
    .catch(next);
  // .catch((err) => next(validation(err, MESSAGES.userNotFound)));
};

module.exports.getUser = (req, res, next) => {
  User
    .findById(req.params.userId)
    .then((user) => {
      if (!user) throw new UserCastError(MESSAGES.userNotFound);
      res.send(formatUserData(user));
    })
    // .catch((err) => next(validation(err, MESSAGES.userNotFound)));
    .catch(next);
};
