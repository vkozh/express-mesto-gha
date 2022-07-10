/* eslint max-classes-per-file: ['error', 4] */
const CardAuthError = require('../classes/errors');
const Card = require('../models/card');
const { ERRORS, MESSAGES } = require('../utils/constants');

const formatCardData = ({
  name, link, likes, _id, owner,
}) => ({
  name,
  link,
  likes,
  _id,
  owner,
});

class CardCastError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CardCastError';
    this.statusCode = ERRORS.NOT_FOUND;
  }
}

// class CardValidationError extends Error {
//   constructor(message) {
//     super(message);
//     this.name = 'CardValidationError';
//     this.statusCode = ERRORS.UNCORRECT;
//   }
// }

// const validation = (err, message = err.message) => {
//   switch (err.name) {
//     case 'ValidationError':
//       return new CardValidationError(message);
//     case 'CastError':
//       return err.code === 404
//         ? new CardCastError(message)
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
      if (!card) throw new CardCastError(MESSAGES.cardNotFound);
      res.send(formatCardData(card));
    })
    // .catch((err) => next(validation(err, MESSAGES.errorCardCreate)));
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      res.send(card);
    })
    // .catch((err) => next(validation(err, MESSAGES.cardNotFound)));
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
      if (!card) throw new CardCastError(MESSAGES.cardNotFound);
      res.send(formatCardData(card));
    })
    .catch(next);
  // .catch((err) => next(validation(err, MESSAGES.errorSetLike)));
};

module.exports.deleteLike = (req, res, next) => {
  Card
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .then((card) => {
      if (!card) throw new CardCastError(MESSAGES.cardNotFound);
      res.send(formatCardData(card));
    })
    .catch(next);
  // .catch((err) => next(validation(err, MESSAGES.errorRemoveLike)));
};

module.exports.getCards = (req, res, next) => {
  Card
    .find({})
    .then((cards) => {
      if (!cards) throw new CardCastError(MESSAGES.cardNotFound);
      res.send(cards.map(formatCardData));
    })
    .catch(next);
  // .catch((err) => next(validation(err, MESSAGES.cardNotFound)));
};

module.exports.getCard = (req, res, next) => {
  Card
    .findById(req.params.cardId)
    .then((card) => res.send(formatCardData(card)))
    .catch(next);
  // .catch((err) => next(validation(err, MESSAGES.cardNotFound)));
};

module.exports.checkOwner = (req, res, next) => {
  Card
    .findById(req.params.cardId)
    .then((card) => {
      if (!card) throw new CardCastError(MESSAGES.cardNotFound);
      if (req.user._id !== card.owner.toString()) next(new CardAuthError(MESSAGES.needAuth));
      next();
    })
    .catch(next);
  // .catch((err) => next(validation(err, MESSAGES.cardNotFound)));
};
