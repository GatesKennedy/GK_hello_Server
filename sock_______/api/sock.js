//  EXPRESS
const express = require('express');
const { check, validationResult } = require('express-validator');
//  MID
const auth = require('../../api_______/middleware/auth');
//  ENV

const router = express.Router();
//  ===============
//  ==   /sock   ==
//  ===============

//  LOAD CHAT
//  @route      GET api/sock
//  @desc       AUTH Token | LOAD User Chats
//  @access     PRIVATE
router.get('/', auth, async (request, response, next) => {
  console.log('(^=^) GET: api/sock > Enter FXN');
});

module.exports = router;
