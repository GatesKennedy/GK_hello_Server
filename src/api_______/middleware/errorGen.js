const { json } = require('express');

// app.use(err, req, res, next) => {

// };

const catchAsync = (fxn) => {
  console.log('UTIL: catchAsync()');
  return (req, res, next) => {
    // fxn(req, res, next).catch((err) => next(err));
    fxn(req, res, next).catch(next);
  };
};

//  Error Types
const sendErrorDev = (err, res) => {
  console.log('UTIL: sendErrorDev()');
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  console.log('UTIL: sendErrorProd()');

  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // Programming or other unknown error
  } else {
    // 1) Log error
    console.error('ERROR 💥: ', err);

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Oh no... Oh god... Damn!',
    });
  }
};

module.exports = {
  catchAsync,
  sendErrorDev,
  sendErrorProd,
};
