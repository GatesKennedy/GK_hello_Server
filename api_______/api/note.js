//  EXPRESS
const express = require('express');
const { check, validationResult } = require('express-validator');
//  TOOL/PKG
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
//  MID
const auth = require('../middleware/auth');
const pool = require('../../db_______/db');
//  ENV
const shhh = process.env.JWT_SHHH;

const router = express.Router();
//  =============
//  ==   GET   ==
//  =============

//  LOAD NOTES
//  @route      GET api/note/
//  @desc       AUTH Token | LOAD User Notes
//  @access     PRIVATE
router.get('/', auth, async (request, response, next) => {
  console.log('(^=^) GET: api/note/ > LOAD NOTES >  Enter FXN');

  try {
    response.status(200).json(rows[0]);
  } catch (err) {
    console.error('(>_<) GET: api/note/ > LOAD NOTES > catch: ' + err.message);
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

module.exports = router;
