//  EXPRESS
const express = require('express');
const { check, validationResult } = require('express-validator');
//  MID
const auth = require('../middleware/auth');
const pool = require('../../db_______/db');
//  ENV

const router = express.Router();
//  =============
//  ==   GET   ==
//  =============

//  LOAD NOTES
//  @route      GET api/chat/
//  @desc       AUTH Token | LOAD User Chats
//  @access     PRIVATE
router.get('/', auth, async (request, response, next) => {
  console.log('(^=^) GET: api/chat/ > LOAD CHATS >  Enter FXN');

  try {
    response.status(200).json(rows[0]);
  } catch (err) {
    console.error('(>_<) GET: api/chat/ > LOAD CHATS > catch: ' + err.message);
    return next(err);
  }
});

//  ==============
//  ==   POST   ==
//  ==============

//  LOGIN
//  @route      POST api/user/login/
//  @desc       LOGIN-AUTH User | GET Token
//  @access     PUBLIC

//-----------------------------------------------------------------
//  Catch-All Error Function
router.use((err, req, res, next) => {
  res.json(err);
});

module.exports = router;
