/* eslint max-classes-per-file: ['error', 4] */
const { CustomCastError, CardAuthError } = require('../classes/errors');
const Card = require('../models/card');
const { MESSAGES } = require('../utils/constants');

const formatCardData = ({
  name, link, likes, _id, owner,
}) => ({
  name,
  link,
  likes,
  _id,
  owner,
});

// const validation = (err, message = err.message) => {
//   switch (err.name) {
//     case 'ValidationError':
//       return new CardValidationError(message);
//     case 'CastError':
//       return err.code === 404
//         ? new CustomCastError(message)
//         : new CardValidationError(message);
//     default:
//       return new Error(err.message);
//   }
// };

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card
    .create({ name, link, owner: req.user._id })
    .then((card) => {
      if (!card) throw new CustomCastError(MESSAGES.cardNotFound);
      res.send(formatCardData(card));
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      res.send(card);
    })
    .catch(next);
};

module.exports.setLike = (req, res, next) => {
  Card
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .then((card) => {
      if (!card) throw new CustomCastError(MESSAGES.cardNotFound);
      res.send(formatCardData(card));
    })
    .catch(next);
};

module.exports.deleteLike = (req, res, next) => {
  Card
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .then((card) => {
      if (!card) throw new CustomCastError(MESSAGES.cardNotFound);
      res.send(formatCardData(card));
    })
    .catch(next);
};

module.exports.getCards = (req, res, next) => {
  Card
    .find({})
    .then((cards) => {
      if (!cards) throw new CustomCastError(MESSAGES.cardNotFound);
      res.send(cards.map(formatCardData));
    })
    .catch(next);
};

module.exports.getCard = (req, res, next) => {
  Card
    .findById(req.params.cardId)
    .then((card) => {
      if (!card) throw new CustomCastError(MESSAGES.cardNotFound);
      res.send(formatCardData(card));
    })
    .catch(next);
};

module.exports.checkOwner = (req, res, next) => {
  Card
    .findById(req.params.cardId)
    .then((card) => {
      if (!card) throw new CustomCastError(MESSAGES.cardNotFound);
      if (req.user._id !== card.owner.toString()) throw new CardAuthError(MESSAGES.needAuth);
      next();
    })
    .catch(next);
};
