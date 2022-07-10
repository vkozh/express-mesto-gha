/* eslint max-classes-per-file: ['error', 7] */

const { ERRORS } = require('../utils/constants');

class AuthValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthValidationError';
    this.statusCode = ERRORS.UNAUTHORIZED;
  }
}

class UserCastError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UserCastError';
    this.statusCode = ERRORS.NOT_FOUND;
  }
}

class UserValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UserValidationError';
    this.statusCode = ERRORS.UNCORRECT;
  }
}

class CardValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CardValidationError';
    this.statusCode = ERRORS.UNCORRECT;
  }
}

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConflictError';
    this.statusCode = ERRORS.CONFLICT;
  }
}

class AuthError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthError';
    this.statusCode = ERRORS.UNAUTHORIZED;
  }
}

class CardAuthError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CardAuthError';
    this.statusCode = ERRORS.FORBIDDEN;
  }
}

module.exports = {
  CardAuthError,
  AuthError,
  UserCastError,
  ConflictError,
  CardValidationError,
  UserValidationError,
  AuthValidationError,
};
