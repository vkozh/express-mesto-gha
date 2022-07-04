const mongoose = require('mongoose');
const valid = require('validator');
const bcrypt = require('bcryptjs');
const { MESSAGES } = require('../utils/constants');

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
    validate: {
      validator(v) {
        return valid.isURL(v);
      },
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return valid.isEmail(v);
      },
    },
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
    validate: {
      validator(v) {
        return valid.isStrongPassword(v);
      },
    },
    select: false,
  },
});
// /https?\:\/\/(w{3}\.)?\S+\.\w+(\/\S+)*\#?/g
userSchema.statics.findByCredentials = (email, password) => {
  this.findOne(email).select('+password').then((user) => {
    // console.log('findByCredentials, USER:', user);
    if (!user) Promise.reject(new Error(MESSAGES.wrongUserData));
    return bcrypt
      .compare(password, user.password)
      .then((matched) => {
        if (!matched) Promise.reject(new Error(MESSAGES.wrongUserData));
        return user;
      });
  });
};

module.exports = mongoose.model('user', userSchema);
