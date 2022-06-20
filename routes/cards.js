const router = require('express').Router();
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
router.post('/', createCard);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', setLike);
router.delete('/:cardId/likes', deleteLike);

module.exports = router;
