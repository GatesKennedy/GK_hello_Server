const jwt = require('jsonwebtoken');
const shhh = process.env.JWTSHHH;

module.exports = function (req, res, next) {
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
    next();
  } catch (err) {
    res.status(401).json({
      msg: 'Token is not valid',
    });
  }
};

// //  Catch-All Error Function
// router.use((err, req, res, next) => {
//   res.json(err);
// });
