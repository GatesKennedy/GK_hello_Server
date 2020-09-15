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
const { NODE_ENV } = process.env;
//  init
const serv = express();
const PORT = process.env.PORT || 5000;
if (NODE_ENV === 'production') {
  serv.use(enforce.HTTPS({ trustProtoHeader: true }));
  // Use enforce.HTTPS({ trustProtoHeader: true }) in case you are behind
  // a load balancer (e.g. Heroku). See further comments below > [https://www.npmjs.com/package/express-sslify]
  http.createServer(serv).listen(PORT, () =>
    console.log(`
  ~~~~~~~~~ server.js ~~~~~~~~~
  (^=^)  listening on port ${PORT}
          Secure: https
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  `)
  );
} else if (NODE_ENV === 'development') {
  http.createServer(serv).listen(PORT, () =>
    console.log(`
  ~~~~~~~~~ server.js ~~~~~~~~~
  (^=^)  listening on port ${PORT}
          Insecure: http
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  `)
  );
}

//~~~~~~~~~~~~~~~~~~~~~~~
//    Socket.io
//~~~~~~~~~~~~~~~~~~~~~~~

//  import
// const io = require('socket.io')(serv);
//  init
// io.on('connection', (socket) => {
//   socket.emit('chat-message', "oh hi, it's great to see you here.");
// });

// const sockServe = http.createServer();
// const io = require('socket.io')(sockServe);

// io.on('connection', function (client) {
//   socket.emit('chat-message', "oh hi, it's great to see you here.");

//   client.on('register', handleRegister);

//   client.on('join', handleJoin);

//   client.on('leave', handleLeave);

//   client.on('message', handleMessage);

//   client.on('chatrooms', handleGetChatrooms);

//   client.on('availableUsers', handleGetAvailableUsers);

//   client.on('disconnect', function () {
//     console.log('client disconnect...', client.id);
//     handleDisconnect();
//   });

//   client.on('error', function (err) {
//     console.log('received error from client:', client.id);
//     console.log(err);
//   });
// });

// sockServe.listen(5100, function (err) {
//   if (err) {
//     console.log(`(>_<)  ERROR > sockServe.js > sockServe.listen()`);
//     throw err;
//   }
//   console.log(`
//   ~~~~~~~~~ socket.io ~~~~~~~~~
//   (^=^)  listening on port 5100
//   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//   `);
// });

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
let whitelist = [
  process.env.CLIENT_ORIGIN_DEV,
  process.env.CLIENT_ORIGIN_STAGE,
  process.env.CLIENT_ORIGIN_GK,
  process.env.CLIENT_ORIGIN_CONOR,
];
let corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
serv.options('/api/aws', cors(corsOptions)); // include before other routes
serv.use(cors(corsOptions));

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
