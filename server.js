//  Express
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { AWS_FILE_SIZE } = process.env;

//  APIs
const test = require('./api_______/test');
const aws = require('./aws_______/api/action');

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
serv.use('/api/test', test);
serv.use('/api/aws', aws);

// MIDDLEWARE   error handling
serv.use((err, req, res, next) => {
  res.json(err);
});

module.exports = serv;
