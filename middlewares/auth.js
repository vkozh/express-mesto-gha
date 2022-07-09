const { checkToken } = require('../helpers/jwt');
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

  if (!token) next(new AuthValidationError(MESSAGES.needAuth));
  if (token.startsWith('Bearer ')) token = token.replace('Bearer ', '');
  let payload;
  try {
    payload = checkToken(token);
  } catch (err) {
    next(new AuthValidationError(MESSAGES.needAuth));
  }
  req.user = payload;
  next();
};
