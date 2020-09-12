const serv = require('serv');
const { json } = require('express');

// serv.use(err, req, res, next) => {

// };

const catchAsync = (fxn) => {
  return (req, res, next) => {
    // fxn(req, res, next).catch((err) => next(err));
    fxn(req, res, next).catch(next);
  };
};

//  Error Types
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

//   module.exports = (err, req, res, next) => {
//     err.statusCode = err.statusCode || 500;
//     err.status = err.status || 'error';

//     if (process.env.NODE_ENV === 'development') {
//       sendErrorDev(err, res);
//     } else if (process.env.NODE_ENV === 'production') {
//       sendErrorProd(err, res);
//     }
//   };

module.exports = {
  catchAsync,
};
