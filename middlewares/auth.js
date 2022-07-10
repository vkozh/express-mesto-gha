const { checkToken } = require('../helpers/jwt');
const { MESSAGES } = require('../utils/constants');
const { AuthValidationError } = require('../classes/errors');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) next(new AuthValidationError(MESSAGES.needAuth));

  try {
    req.user = checkToken(token);
    next();
  } catch (err) {
    next(new AuthValidationError(MESSAGES.needAuth));
  }
};
