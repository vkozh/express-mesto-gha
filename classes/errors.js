/* eslint max-classes-per-file: ['error', 8] */

const { ERRORS } = require('../utils/constants');

class AuthValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthValidationError';
    this.statusCode = ERRORS.UNAUTHORIZED;
  }
}

class CustomCastError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CardCastError';
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

class CustomValidationError extends Error {
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
  CustomCastError,
  ConflictError,
  UserValidationError,
  CustomValidationError,
  AuthValidationError,
};
