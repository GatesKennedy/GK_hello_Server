const jwt = require('jsonwebtoken');
const { json } = require('express');
const shhh = process.env.JWT_SHHH;

const validateToken = (req, res, next) => {
  console.log('Auth Middleware > validateToken() > enter fxn');
  //  Get token from header
  const token = req.header('x-auth-token');

  //  Check if no token
  if (!token) {
    console.log('Auth Middleware > No token');
    return res.status(401).json({
      msg: 'No token, authorization denied',
    });
  }
  //  Verify token
  try {
    let decoded = jwt.verify(token, shhh);
    console.log('**** decoded.user: ', decoded.user);
    console.log('**** req.user:     ', req.user);
    req.user = decoded.user;
    next();
  } catch (err) {
    console.log('Auth Middleware > Catch');
    console.log('(>_<) reqUser: ', req.user);
    console.log('(>_<) decUser: ', decoded.user);
    res.status(401).json({
      msg: 'Token is not valid ',
    });
    return next(err);
  }
};

module.exports = {
  validateToken,
};
