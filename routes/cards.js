const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards,
  createCard,
  deleteCard,
  setLike,
  deleteLike,
  getCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.get('/:cardId', getCard);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(/https?:\/\/(w{3}\.)?\S+\.\w+(\/\S+)*#?/),
  }),
}), createCard);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', setLike);
router.delete('/:cardId/likes', deleteLike);

module.exports = router;
