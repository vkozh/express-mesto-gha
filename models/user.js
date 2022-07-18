const mongoose = require('mongoose');
const valid = require('validator');
const bcrypt = require('bcryptjs');
const { MESSAGES } = require('../utils/constants');
const { UserValidationError } = require('../classes/errors');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    match: /https?:\/\/(w{3}\.)?\S+\.\w+(\/\S+)*#?/,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator(v) {
        return valid.isEmail(v);
      },
      message: MESSAGES.emailUncorrect,
    },
  },
  password: {
    type: String,
    select: false,
    required: true,
  },
});

userSchema.statics.findByCredentials = function (email, password) {
  return this
    .findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) throw new UserValidationError(MESSAGES.wrongUserData);
      return bcrypt
        .compare(password, user.password)
        .then((matched) => {
          if (!matched) throw new UserValidationError(MESSAGES.wrongUserData);
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
