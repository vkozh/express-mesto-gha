const { checkToken } = require('../helpers/jwt');
const { MESSAGES } = require('../utils/constants');
const { AuthValidationError } = require('../classes/errors');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) return next(new AuthValidationError(MESSAGES.needAuth));

  try {
    req.user = checkToken(token);
    return next();
  } catch (err) {
    return next(new AuthValidationError(MESSAGES.needAuth));
  }
};
