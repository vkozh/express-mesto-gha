const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers,
  getUser,
  updateProfile,
  updateAvatar,
  getProfile,
} = require('../controllers/users');

const validUserId = {
  params: Joi.object().keys({
    userId: Joi.string().pattern(/^[a-f\d]{24}$/i),
  }),
};

const validCard = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
};

const validAvatar = {
  body: Joi.object().keys({
    avatar: Joi.string().pattern(/https?:\/\/(w{3}\.)?\S+\.\w+(\/\S+)*#?/),
  }),
};

router.get('/', getUsers);

router.get('/me', getProfile);

router.get('/:userId', celebrate(validUserId), getUser);

router.patch('/me', celebrate(validCard), updateProfile);

router.patch('/me/avatar', celebrate(validAvatar), updateAvatar);

module.exports = router;
