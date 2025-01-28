const jwt = require('jsonwebtoken');
require('dotenv').config();

const secret = process.env.JWTSECRET;
const expiration = process.env.TOKENEXPIRATION;

exports.generateToken = (payload) => {
  return jwt.sign(payload, secret, { expiresIn: expiration });
};

exports.verifyToken = (token) => {
  return jwt.verify(token, secret);
};
