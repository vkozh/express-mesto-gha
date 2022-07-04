const jwt = require('jsonwebtoken');
const { MESSAGES, ERRORS } = require('../utils/constants');

class AuthValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthValidationError';
    this.statusCode = ERRORS.UNAUTHORIZED;
  }
}

module.exports = (req, res, next) => {
  let token = req.cookies.jwt;
  if (!token || token.startsWith('Bearer ')) next(new AuthValidationError(MESSAGES.needAuth));
  token = token.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    next(new Error(MESSAGES.needAuth));
  }
  req.user = payload;
  next();
};
