const { default: mongoose } = require("mongoose");
const Card = require("../models/card");
const { ERRORS, MESSAGES } = require("../utils/constants");

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(getCardData(card)))
    .catch((err) => catchErr(err, res, MESSAGES.errorCardCreate));
};

module.exports.deleteCard = (req, res) =>
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.send(getCardData(card)))
    .catch((err) => catchErr(err, res, MESSAGES.cardNotFound));

module.exports.setLike = (req, res) =>
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => res.send(getCardData(card)))
    .catch((err) => catchErr(err, res, MESSAGES.errorSetLike));

module.exports.deleteLike = (req, res) =>
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => res.send(getCardData(card)))
    .catch((err) => catchErr(err, res, MESSAGES.errorRemoveLike));

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards.map(getCardData)))
    .catch((err) => catchErr(err, res));
};

module.exports.getCard = (req, res) => {
  Card.findById(req.params.cardId)
    .then((card) => res.send(getCardData(card)))
    .catch((err) => catchErr(err, res, MESSAGES.cardNotFound));
};

const validation = (err, message = err.message) => {
  switch (err.name) {
    case "ValidationError":
      return new CardValidationError(message);
    case "CastError":
      return new CardCastError(message);
    default:
      return new ServerError(err.message);
  }
};

const catchErr = (err, res, msg) => {
  const { statusCode, message } = validation(err, msg);
  res.status(statusCode).send({ message });
};

const getCardData = (card) => {
  if (card)
    return {
      name: card.name,
      link: card.link,
      likes: card.likes,
      _id: card._id,
      owner: card.owner,
    };
  throw new CardCastError(MESSAGES.cardNotFound);
};

class CardCastError extends Error {
  constructor(message) {
    super(message);
    this.name = "CardCastError";
    this.statusCode = ERRORS.NOT_FOUND;
  }
}

class CardValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "CardValidationError";
    this.statusCode = ERRORS.UNCORRECT;
  }
}

class ServerError extends Error {
  constructor(message) {
    super(message);
    this.name = "ServerError";
    this.statusCode = ERRORS.SERVER_ERR;
  }
}
