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
//    EXPRESS
//~~~~~~~~~~~~~~~~~~~~~~~

//  import
const express = require('express');
const http = require('http');
const enforce = require('express-sslify');
//  init
const serv = express();
serv.use(enforce.HTTPS({ trustProtoHeader: true }));
const PORT = process.env.PORT || 5000;
// Use enforce.HTTPS({ trustProtoHeader: true }) in case you are behind
// a load balancer (e.g. Heroku). See further comments below > [https://www.npmjs.com/package/express-sslify]

console.log();
http.createServer(serv).listen(PORT, () =>
  console.log(`
  ~~~~~~~~~ server.js ~~~~~~~~~
  (^=^)  listening on port ${PORT}
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  `)
);

//~~~~~~~~~~~~~~~~~~~~~~~
//    Socket.io
//~~~~~~~~~~~~~~~~~~~~~~~

//  import
const io = require('socket.io')(5555);
//  init
io.on('connection', (socket) => {
  socket.emit('chat-message', "oh hi, it's great to see you here.");
});

//~~~~~~~~~~~~~~~~~~~~~~~
//    MIDDLEWARE
//~~~~~~~~~~~~~~~~~~~~~~~

//  import
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { AWS_FILE_SIZE } = process.env;
//  init
serv.use(bodyParser.json());
serv.use(express.json({ extended: false }));
serv.use(express.urlencoded({ extended: true }));
serv.use(
  fileUpload({
    createParentPath: true,
    useTempFiles: true,
    tempFileDir: '/temp/',
    limits: AWS_FILE_SIZE,
    safeFileNames: true,
    preserveExtension: true,
  })
);
serv.use(cors());
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
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
// };
// serv.options('/api/aws', cors(corsOptions)); // include before other routes
// serv.use(cors(corsOptions));

//~~~~~~~~~~~~~~~~~~~~~~~
//      ROUTES
//~~~~~~~~~~~~~~~~~~~~~~~

//  import
const auth = require('./api_______/api/auth');
const user = require('./api_______/api/user');
const chat = require('./api_______/api/chat');
const note = require('./api_______/api/note');
const aws = require('./aws_______/api/action');
//  init
serv.use('/api/auth', auth);
serv.use('/api/user', user);
serv.use('/api/chat', chat);
serv.use('/api/note', note);
serv.use('/api/aws', aws);
serv.all('*', (req, res, next) => {
  next(new AppError(`Oops.. ${req.originalUrl} is not for you!`, 404));
});

//~~~~~~~~~~~~~~~~~~~~~~~
//  ERROR HANDLING
//~~~~~~~~~~~~~~~~~~~~~~~

//  import
const {
  sendErrorDev,
  sendErrorProd,
} = require('./api_______/middleware/errorGen');
//  init
serv.use((err, req, res, next) => {
  console.log(`OOPS > NEXT FXN >`);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'Oops.. error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    sendErrorProd(err, res);
  }
});

module.exports = serv;
