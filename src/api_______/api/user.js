//  EXPRESS
const express = require('express');
const { check, validationResult } = require('express-validator');
//  TOOL/PKG
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
//  MID
// const auth = require('../middleware/auth');
const { validateToken } = require('../middleware/auth');
const pool = require('../../db_______/db');
//  ENV
const shhh = process.env.JWT_SHHH;

const router = express.Router();

//  =============
//  ==   GET   ==
//  =============

//  LOAD USER
//  @route      GET api/user/
//  @desc       AUTH Token | LOAD User
//  @access     PRIVATE
router.get('/', validateToken, async (request, response, next) => {
  console.log('(^=^) GET: api/auth/ > LOAD USER >  Enter FXN');
  const queryText = `
      SELECT 
        u.id, 
        u.name, 
        u.email, 
        u.role, 
        u.date_join,
        p.entity,
        p.website,
        p.thought,
        p.puzzle,
        p.joke,
        p.question,
        p.img_url,
        p.location
      FROM tbl_user AS u
      INNER JOIN tbl_profile AS p ON u.id = p.user_id
      WHERE u.id=($1)`;
  try {
    const { rows } = await pool.query(queryText, [request.user.id]);
    console.log('Load Auth User > req.user.id: ', request.user.id);

    response.status(200).json(rows[0]);
  } catch (err) {
    console.error('(>_<) auth.js > GET AUTH > err.message: ' + err.message);
    return next(err);
  }
});

//  ==============
//  ==   POST   ==
//  ==============

//  LOGINKs
//  @route      POST api/user/login/
//  @desc       LOGIN-AUTH User | GET Token
//  @access     PUBLIC

module.exports = router;
