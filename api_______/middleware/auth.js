const jwt = require('jsonwebtoken');
const { json } = require('express');
const shhh = process.env.JWT_SHHH;

module.exports = function (req, res, next) {
  console.log('authenticate user > enter fxn');
  //  Get token from header
  const token = req.header('x-auth-token');

  //  Check if no token
  if (!token) {
    return res.status(401).json({
      msg: 'No token, authorization denied',
    });
  }
  //  Verify token
  try {
    const decoded = jwt.verify(token, shhh);
    req.user = decoded.user;
    // console.log('**** decoded.user: ', decoded.user);
    // console.log('**** req.user:     ', req.user);
    next();
  } catch (err) {
    // const reqUser = JSON.stringify(req.user);
    // const decUser = JSON.stringify(decoded.user);
    // console.log('reqUser: ', reqUser);
    // console.log('decUser: ', decUser);
    res.status(401).json({
      msg: 'Token is not valid ',
    });
  }
};

// //  Catch-All Error Function
// router.use((err, req, res, next) => {
//   res.json(err);
// });
