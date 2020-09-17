//  EXPRESS
const express = require('express');
const path = require('path');
var appDir = path.dirname(require.main.filename);
const { check, validationResult } = require('express-validator');
//  MID
const auth = require('../../api_______/middleware/auth');
//  ENV

const router = express.Router();
//  ===============
//  ==   /sock   ==
//  ===============

//  GET
//  @route      GET api/sock
//  @desc       test connection
//  @access     PRIVATE
router.get('/', async (request, response, next) => {
  console.log('GET: api/sock > Enter FXN');
  response.sendFile(path.join(appDir + '/index.html'));
});

//  POST
//  @route      GET api/sock
//  @desc       test send content
//  @access     PRIVATE
router.post('/', async (request, response, next) => {
  console.log('POST: api/sock > Enter FXN');
});

//  PUT
//  @route      GET api/sock
//  @desc       test put?
//  @access     PRIVATE
router.put('/', async (request, response, next) => {
  console.log('PUT: api/sock > Enter FXN');
});

module.exports = router;
