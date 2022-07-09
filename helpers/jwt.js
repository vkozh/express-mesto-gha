const jwt = require('jsonwebtoken');

const KEY = 'some-secret-key';

const createToken = (payload) => jwt.sign(payload, KEY, { expiresIn: '7d' });

const checkToken = (token) => jwt.verify(token, KEY);

module.exports = { createToken, checkToken };
