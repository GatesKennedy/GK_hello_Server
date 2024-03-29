// const { c } = process.env; //!!!

//~~~~~~~~~~~~~~~~~~~~~~~
//    Environment
//~~~~~~~~~~~~~~~~~~~~~~~
import 'dotenv/config' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
console.log("\n~~~~~~~~~~~~\nprocess.env.NODE_ENV = \n~~~~~~~~~~~~\n", process.env.NODE_ENV);

//~~~~~~~~~~~~~~~~~~~~~~~
//    Classes
//~~~~~~~~~~~~~~~~~~~~~~~

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

//~~~~~~~~~~~~~~~~~~~~~~~
//    EXPRESS APP
//~~~~~~~~~~~~~~~~~~~~~~~

//  init express app
import express from 'express'
const app = express();

//  ~~~~~~~~~~~~
//  ~~  CORS  ~~
const cors = require('cors');

// let whitelist = [
//   process.env.CLIENT_ORIGIN_DEV,
//   process.env.CLIENT_ORIGIN_STAGE,
//   process.env.CLIENT_ORIGIN_GK,
//   process.env.CLIENT_ORIGIN_CONOR,
// ];
// let corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1 || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
//   optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
// };

let envOrigin;
switch (process.env.NODE_ENV) {
  case 'development':
    envOrigin = process.env.CLIENT_ORIGIN_DEV;
    break;
  case 'staging':
    envOrigin = process.env.CLIENT_ORIGIN_STAGE;
    break;
  case 'production':
    envOrigin = process.env.CLIENT_ORIGIN_CONOR;
    break;
  default:
    envOrigin = process.env.CLIENT_ORIGIN_CONOR;
    break;
}
let corsOptions = {
  origin: envOrigin,
  methods: ['GET', 'HEAD', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

//  CORS - Pre-Flight
app.options('*', cors(corsOptions)); // enable pre-flight for all, include before other routes
// app.options('/api/auth/login', cors(corsOptions), (req, res, next) => {
//   res.json({
//     msg: `'CORS-enabled Pre-Flight'
//       envOrigin: ${envOrigin}`,
//   });
// });
app.options('/api/test', cors(corsOptions), (req, res, next) => {
  res.json({
    msg: `'CORS-enabled Pre-Flight'
      envOrigin: ${envOrigin}`,
  });
});
app.use(cors(corsOptions));

//~~~~~~~~~~~~~~~~~~~~~~~
//    MIDDLEWARE
//~~~~~~~~~~~~~~~~~~~~~~~

//  express
app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: true }));

//  express-sslify
const enforce = require('express-sslify');
if (process.env.NODE_ENV === 'production') {
  app.use(enforce.HTTPS({ trustProtoHeader: true }));
  //  Use enforce.HTTPS({ trustProtoHeader: true }) in case you are behind a load balancer (e.g. Heroku).
  //  See further comments below > [https://www.npmjs.com/package/express-sslify]
}

//  fileUpload
const fileUpload = require('express-fileupload');
const { AWS_FILE_SIZE } = process.env;
app.use(
  fileUpload({
    createParentPath: true,
    useTempFiles: true,
    tempFileDir: '/temp/',
    limits: AWS_FILE_SIZE,
    safeFileNames: true,
    preserveExtension: true,
  })
);

//  secure Redirect Heroku
// const { secureRedirectHerokuMW } = require('./api_______/middleware/security');
// const dev = NODE_ENV === 'development';
// app.use(secureRedirectHerokuMW({ NodeEnv: dev }));

//  validate Token
// const { validateToken } = require('./api_______/middleware/auth');
// app.use(validateToken)

//~~~~~~~~~~~~~~~~~~~~~~~
//  ERROR HANDLING
//~~~~~~~~~~~~~~~~~~~~~~~

//  import
const {
  sendErrorDev,
  sendErrorProd,
} = require('./api_______/middleware/errorGen');
//  init
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'Oops.. error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    sendErrorProd(err, res);
  }
});

//~~~~~~~~~~~~~~~~~~~~~~~
//      ROUTES
//~~~~~~~~~~~~~~~~~~~~~~~
//  import
const auth = require('./api_______/api/auth');
const user = require('./api_______/api/user');
const talk = require('./api_______/api/talk');
const chat = require('./api_______/api/chat');
const note = require('./api_______/api/note');
const aws = require('./aws_______/api/action');
const test = require('./api_______/api/test');
// const test = require('./api/______/api/test');
//  init
app.use('/api/auth', auth);
app.use('/api/user', user);
app.use('/api/talk', talk);
app.use('/api/chat', chat);
app.use('/api/note', note);
app.use('/api/aws', aws);
app.use('/api/test', test);
app.all('*', (req, res, next) => {
  next(new AppError(`Oops.. ${req.originalUrl} is not for you!`, 404));
});

//~~~~~~~~~~~~~~~~~~~~~~~
//    Server Init
//~~~~~~~~~~~~~~~~~~~~~~~
const PORT = process.env.PORT || 5555;
const http = require('http');
//  init
const serv = http.createServer(app);
serv.listen(PORT, () => {
  if (process.env.NODE_ENV === 'production') {
    console.log(`
    ~~~~~~~~~ server.js ~~~~~~~~~
    (^=^)  production listening on port ${PORT}
            Secure: https
            Origin: ${envOrigin}
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    `);
  } else if (process.env.NODE_ENV === 'development') {
    console.log(`
    ~~~~~~~~~ server.js ~~~~~~~~~
    (^=^)  development listening on port ${PORT}
            Insecure: http
            Origin: ${envOrigin}
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    `);
  }
});

module.exports = serv;
