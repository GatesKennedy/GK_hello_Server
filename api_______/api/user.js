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

//  LOAD USER
//  @route      GET api/user/
//  @desc       AUTH Token | LOAD User
//  @access     PRIVATE
router.get('/', auth, async (request, response, next) => {
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
        p.img_url,
        p.location
      FROM tbl_user AS u
      INNER JOIN tbl_profile AS p ON u.id = p.user_id
      WHERE u.id=($1)`;
  try {
    const { rows } = await pool.query(queryText, [request.user.id]);

    response.status(200).json(rows[0]);
  } catch (err) {
    console.error('(._.) auth.js > GET AUTH >catch: ' + err.message);
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
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (request, response, next) => {
    console.log('(^=^) LOGIN USER > POST: api/auth/ > Enter FXN');
    const { email, password } = request.body;
    const bodyStr = JSON.stringify(request.body);
    console.log('(o_O) LOGIN USER > body: ' + bodyStr);
    //  Validation Error Response
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
    console.log('(o_O) LOGIN USER > validation: PASS');

    //  Async db Connection
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      //  Check Email exists
      const queryText = 'SELECT * FROM tbl_user WHERE email = ($1)';
      const res = await client.query(queryText, [email]);
      //  Error Res
      if (!res.rows.length > 0) {
        return response
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }
      console.log('(o_O) LOGIN USER > Email Exists: PASS');

      //  Check Password
      const isMatch = await bcrypt.compare(password, res.rows[0].password);
      //  Error Res
      if (!isMatch) {
        return response
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }
      console.log('(o_O) LOGIN USER > Password Matches: PASS');

      //  Return JWT
      const userId = res.rows[0].id;
      const payload = {
        user: {
          id: userId,
        },
      };
      console.log('(o_O) LOGIN USER > AuthUser ID = ' + userId);
      jwt.sign(payload, shhh, { expiresIn: 18000 }, (err, token) => {
        if (err) throw err;
        const tokenLoad = JSON.stringify(token);
        console.log('(o_O) LOGIN USER > tokenLoad: ' + tokenLoad);
        response.json({ token });
      });

      //  COMMIT
      await client.query('COMMIT');
      console.log('(^=^) LOGIN USER > DONE');

      //=============
      //  CATCH
    } catch (err) {
      console.log('(>_<) LOGIN USER > FAIL Catch Err: ' + err.message);
      await client.query('ROLLBACK');
      return next(err);
    } finally {
      client.release();
    }
    //response.redirect('/');
  }
);

//  REGISTER
//  @route      POST api/user/register
//  @desc       REGISTER User
//  @access     PUBLIC
router.post(
  '/register',
  [
    check('username', 'username is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({
      min: 6,
    }),
  ],
  async (request, response, next) => {
    console.log('(^=^) POST: api/auth/register > REGISTER USER > Enter FXN');
    //  Error Response
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = request.body;
    const role = 'user';

    //  Async db Connection
    const client = await pool.connect();
    try {
      //  Check: User Registration
      await client.query('BEGIN');
      //  Check Email exists
      const queryText = 'SELECT name FROM tbl_user WHERE email = ($1)';
      const { rows } = await client.query(queryText, [email]);
      if (rows.length > 0) {
        return response
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }
      console.log('>Email');
      //  Encrypt User Password
      const salt = await bcrypt.genSalt(10);
      const pwCrypt = await bcrypt.hash(password, salt);
      console.log('>Password');
      //  Create User
      const insertText = `INSERT INTO tbl_user(name, email, password, role) 
        VALUES($1, $2, $3, $4) 
        RETURNING id`;
      const insertValues = [username, email, pwCrypt, role];
      const rez = await client.query(insertText, insertValues);
      console.log('>INSERT');
      //  Return JWT
      const payload = {
        user: {
          id: rez.rows[0].id,
        },
      };
      jwt.sign(payload, shhh, { expiresIn: 1800 }, (err, token) => {
        if (err) throw err;
        response.json({ token: token, userName: username }).redirect('/talk');
      });
      console.log('>JWT');
      await client.query('COMMIT');
      console.log('(^=^) REGISTER USER > DONE');
    } catch (err) {
      //  Catch
      await client.query('ROLLBACK');
      console.error(
        '(>_<) REGISTER USER > FAIL > CatchBlock Err: ' + err.message
      );
      return next(err);
    } finally {
      //  Finally
      client.release();
    }
    //  Redirect to /talk
  }
);

//-----------------------------------------------------------------
//  Catch-All Error Function
router.use((err, req, res, next) => {
  res.json(err);
});

module.exports = router;
