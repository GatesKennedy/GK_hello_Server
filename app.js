const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

//  FXNs
//  utility functions for startup execution

//  APIs
const test = require('./nds_server/test');

//~~~~~~~~~~~~~~~~~~~~~~~
//  Init EXPRESS
const serv = express();
const PORT = process.env.PORT || 5000;
//  log on connect
console.log('~~~~~ server.js ~~~~~');
serv.listen(PORT, () =>
  console.log(`(^=^)  GOOD: Server listening on port ${PORT}`)
);

//~~~~~~~~~~~~~~~~~~~~~~~
//    Init MIDDLEWARE
serv.use(express.json({ extended: false }));
serv.use(express.urlencoded({ extended: true }));
serv.use(bodyParser.json({ extended: false }));
serv.use(bodyParser.urlencoded({ extended: true }));
//  CORS
var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
serv.use(cors(corsOptions));

//~~~~~~~~~~~~~~~~~~~~~~~
//    API Routes
serv.use('/api/test', test);

//~~~~~~~~~~~~~~~~~~~~~~~
//    AWS config

// MIDDLEWARE   error handling
serv.use((err, req, res, next) => {
  res.json(err);
});

module.exports = serv;
