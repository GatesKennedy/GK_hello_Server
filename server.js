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
const app = express();
const PORT = process.env.PORT || 5000;
const serv = http.createServer(app);

if (NODE_ENV === 'production') {
  app.use(enforce.HTTPS({ trustProtoHeader: true })); // Use enforce.HTTPS({ trustProtoHeader: true }) in case you are behind a load balancer (e.g. Heroku). See further comments below > [https://www.npmjs.com/package/express-sslify]
}

serv.listen(PORT, () => {
  if (NODE_ENV === 'production') {
    console.log(`
    ~~~~~~~~~ server.js ~~~~~~~~~
    (^=^)  listening on port ${PORT}
            Secure: https
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    `);
  } else if (NODE_ENV === 'development') {
    console.log(`h
    ~~~~~~~~~ server.js ~~~~~~~~~
    (^=^)  listening on port ${PORT}
            Insecure: http
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    `);
  }
});

//~~~~~~~~~~~~~~~~~~~~~~~
//    Socket.io
//~~~~~~~~~~~~~~~~~~~~~~~

//  import
// const io = require('socket.io')(app);
//  init
// io.on('connection', (socket) => {
//   socket.emit('chat-message', "oh hi, it's great to see you here.");
// });

// // Socket Init 2
// // -------------
// const sockServe = http.createServer();
// const io = require('socket.io')(sockServe);
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

// // Socket Init 3
// // -------------
//  import
const {
  handleRegister,
  handleEvent,
  handleJoin,
  handleDisconnect,
} = require('./sock_______/HelpServe');
//  init
const io = require('socket.io')(serv);

io.on('connection', function (client) {
  console.log('frkn user connected');

  client.on('message', (data) => {
    io.emit('message', data);
  });
  client.on('sockMsg', (data) => {
    console.log('sockMsg', data);
    io.emit('sockMsg', data);
  });
  // client.on('leave', handleLeave);

  // client.on('join', handleJoin);

  // client.on('register', handleRegister);

  // client.on('chatrooms', handleGetChatrooms);

  // client.on('availableUsers', handleGetAvailableUsers);

  client.on('disconnect', function () {
    console.log('client disconnect...', client.id);
    // handleDisconnect();
  });

  client.on('error', function (err) {
    console.log('received error from client:', client.id);
    console.log(err);
  });
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
app.use(bodyParser.json());
app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: true }));
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

app.use(cors());
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
app.options('/api/aws', cors(corsOptions)); // include before other routes
app.use(cors(corsOptions));

//~~~~~~~~~~~~~~~~~~~~~~~
//      ROUTES
//~~~~~~~~~~~~~~~~~~~~~~~
//  import
const sock = require(`./sock_______/api/sock`);
const auth = require('./api_______/api/auth');
const user = require('./api_______/api/user');
const chat = require('./api_______/api/chat');
const note = require('./api_______/api/note');
const aws = require('./aws_______/api/action');
//  init
app.use('/api/auth', auth);
app.use('/api/user', user);
app.use('/api/sock', sock);
app.use('/api/chat', chat);
app.use('/api/note', note);
app.use('/api/aws', aws);
app.all('*', (req, res, next) => {
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
app.use((err, req, res, next) => {
  console.log(`OOPS > NEXT FXN >`);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'Oops.. error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    sendErrorProd(err, res);
  }
});

module.exports = { app, serv, io };
