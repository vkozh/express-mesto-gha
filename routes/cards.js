const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards,
  createCard,
  deleteCard,
  setLike,
  deleteLike,
  getCard,
  checkOwner,
} = require('../controllers/cards');

const validCardId = {
  params: Joi.object().keys({
    cardId: Joi.string().hex(),//.pattern(/^[a-f\d]{24}$/i),
  }),
};

const validCard = {
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(/https?:\/\/(w{3}\.)?\S+\.\w+(\/\S+)*#?/),
  }),
};

router.get('/', getCards);

router.get('/:cardId', celebrate(validCardId), getCard);

router.post('/', celebrate(validCard), createCard);

router.delete('/:cardId', celebrate(validCardId), checkOwner);
router.delete('/:cardId', celebrate(validCardId), deleteCard);

router.delete('/:cardId/likes', celebrate(validCardId), deleteLike);

router.put('/:cardId/likes', celebrate(validCardId), setLike);

module.exports = router;
