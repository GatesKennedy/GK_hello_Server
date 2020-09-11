//  Express
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { AWS_FILE_SIZE } = process.env;
//  APIs
const auth = require('./api_______/api/auth');
const user = require('./api_______/api/user');
const chat = require('./api_______/api/chat');
const note = require('./api_______/api/note');
const aws = require('./aws_______/api/action');
// const test = require('./api_______/test');
//  Socket.io
const io = require('socket.io')(5555);
//~~~~~~~~~~~~~~~~~~~~~~~
//  Init EXPRESS variable
const serv = express();
const PORT = process.env.PORT || 5000;
//  log on connect
console.log('~~~~~ server.js ~~~~~');
serv.listen(PORT, () =>
  console.log(`(^=^)  GOOD: Server listening on port ${PORT}`)
);
//~~~~~~~~~~~~~~~~~~~~~~~
//    Socket.id
io.on('connection', (socket) => {
  socket.emit('chat-message', "oh hi, it's great to see you here.");
});

//~~~~~~~~~~~~~~~~~~~~~~~
//    Init MIDDLEWARE

//  Express bodyParser
serv.use(express.json({ extended: false }));
serv.use(express.urlencoded({ extended: true }));
// //  CORS
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
serv.use(cors());

//  Express-fileupload
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

//~~~~~~~~~~~~~~~~~~~~~~~
//    LOGS
//console.log('server.js > Environment Variables: \n', process.env);

//~~~~~~~~~~~~~~~~~~~~~~~
//    API Routes
//  _utils
serv.use('/api/auth', auth);
serv.use('/api/user', user);
serv.use('/api/chat', chat);
serv.use('/api/note', note);
serv.use('/api/aws', aws);
// serv.use('/api/test', test);

serv.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Oops.. ${req.originalUrl} is not for you!`,
  // });

  const err = new Error(`Oops.. ${req.originalUrl} is not for you!`);
  err.status = 'fail';
  err.statusCode = 404;

  next(err);
});

// MIDDLEWARE   error handling
serv.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'Oops.. error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

module.exports = serv;
