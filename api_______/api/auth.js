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

//  AUTH USER
//  @route      GET api/auth
//  @desc       AUTH Token | AUTH User
//  @access     PRIVATE
router.get('/', auth, async (request, response, next) => {
  console.log('(^=^) LOAD USER > GET: api/auth/ > Enter FXN');
  const queryText = `
      SELECT 
        id, 
        role
      FROM tbl_user 
      WHERE id=($1)`;
  try {
    const { rows } = await pool.query(queryText, [request.user.id]);

    if (rows.length === 1) {
      const { id, role } = rows[0];
      //~~~~~~~~~~~~~~~~~~~~~~~~~
      //  Return JWT
      const payload = {
        user: {
          id: id,
        },
      };
      jwt.sign(payload, shhh, { expiresIn: 18000 }, (err, token) => {
        if (err) throw err;
        role === 'admin'
          ? response.json({
              token: token,
              role: role,
              msg: `thank god... hi ${name}.`,
            })
          : response.json({
              token: token,
              role: role,
              msg: 'void',
            });
      });
    } else if (rows[0].length < 1) {
      throw 'This User cannot be found';
    } else throw 'There was an error finding this User';
  } catch (err) {
    console.error('(._.) auth.js > GET AUTH > catch: ', err);
    return next(err);
  }
});

//  ==============
//  ==   POST   ==
//  ==============

//  LOGIN
//  @route      POST api/auth/login
//  @desc       LOGIN-AUTH User | GET Token
//  @access     PUBLIC
router.post(
  '/login',
  [
    check('emailIn', 'Please include a valid email').isEmail(),
    check('passwordIn', 'Password is required').exists(),
  ],
  async (request, response, next) => {
    console.log('(^=^) LOGIN USER > POST: api/auth/ > Enter FXN');
    // console.log('(o_O) LOGIN USER > request.body: \n', request.body);
    const { emailIn, passwordIn } = request.body;
    const emailLower = emailIn.toLowerCase();
    console.log('|      user values: ', { emailLower, passwordIn });
    console.log('=========== begin processing');
    //~~~~~~~~~~~~~~~~~~~~~~~~~
    //  Validation Error Response
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      console.log('(>_<) fail validation > errors: ', errors);
      console.log('(>_<) fail validation > errors.array() ', errors.array());
      return response.status(400).json({
        errors: errors.array(),
        valid: false,
        msg: `oh no.. field validation error`,
      });
    }
    console.log('(o_O) LOGIN USER > validation: PASS');
    //~~~~~~~~~~~~~~~~~~~~~~~~~
    //  Async db Connection
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      //~~~~~~~~~~~~~~~~~~~~~~~~~
      //  Check Email
      const queryText = `
        SELECT
            id,
            name,
            email,
            password,
            role
        FROM tbl_user 
        WHERE LOWER(email) = ($1)
        `;

      const { rows } = await client.query(queryText, [emailLower]);
      // console.log(
      //   `(o_O) LOGIN USER > Query Response:
      // |     User: `,
      //   rows[0]
      // );
      const { id, name, email, password, role } = rows[0];
      if (!rows.length > 0) {
        console.log('(>_<) LOGIN USER > NO Email : FAIL');
        return response.status(400).json({
          errors: [{ msg: 'oopsie: email not found' }],
          msg: 'msg: email not found...',
        });
      }
      console.log('(o_O) LOGIN USER > Email Exists: PASS');

      //~~~~~~~~~~~~~~~~~~~~~~~~~
      //  Check Password
      const isMatch = await bcrypt.compare(passwordIn, password);
      if (!isMatch) {
        console.log('(>_<) LOGIN USER > NO Password : FAIL');
        return response.status(400).json({
          errors: [{ msg: 'oopsie: wrong password' }],
          msg: 'msg: wrong password',
        });
      }
      console.log('(o_O) LOGIN USER > Password Matches: PASS');
      //~~~~~~~~~~~~~~~~~~~~~~~~~
      //  Return JWT
      const payload = {
        user: {
          id: id,
        },
      };
      console.log('(o_O) LOGIN USER > AuthUser ID = ', id);
      jwt.sign(payload, shhh, { expiresIn: 18000 }, (err, token) => {
        if (err) throw err;
        console.log('(o_O) LOGIN USER > tokenLoad: ', token);
        role === 'admin'
          ? response
              .json({
                token: token,
                username: name,
                role: role,
                msg: `thank god... hi ${name}.`,
              })
              .redirect('/talk')
          : response
              .json({
                token: token,
                username: name,
                role: role,
                msg: `oh cool. welcome back ${name}`,
              })
              .redirect('/talk');
      });
      //~~~~~~~~~~~~~~~~~~~~~~~~~
      //  COMMIT
      await client.query('COMMIT');
      console.log('(^=^) LOGIN USER > DONE');

      //=============
      //  CATCH
    } catch (err) {
      console.log('(>_<) LOGIN USER > FAIL Catch Err: ' + err.message);
      await client.query('ROLLBACK');
      response.json({
        errors: [
          {
            msg: `oopsie: email not found : 
        ${errors.array()}`,
          },
        ],
        msg: `oh no... an error occured`,
      });
      return next(err);
    } finally {
      client.release();
    }
    //response.redirect('/');
  }
);

//  REGISTER
//  @route      POST api/auth/register
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
      console.log('fail validation: ', errors);
      return response.status(400).json({ errors: errors.array() });
    }
    //  No More Admin
    const { username, email, password, role } = request.body;
    if (role === 'admin') {
      return response.json({ hack: true, msg: 'I love you... do you?' });
    }
    //  Async db Connection
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      //~~~~~~~~~~~~~~~~~~~~~~~~~
      //  @ EMAIL
      const queryText = 'SELECT name FROM tbl_user WHERE email = ($1)';
      const { rows } = await client.query(queryText, [email]);
      if (rows.length > 0) {
        return response
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }
      console.log('>Email');
      //~~~~~~~~~~~~~~~~~~~~~~~~~
      //  @ PASSWORD
      const salt = await bcrypt.genSalt(10);
      const pwCrypt = await bcrypt.hash(password, salt);
      console.log('>Password', pwCrypt);
      //  Get Admin
      const adminText = `
        SELECT id
        FROM tbl_user
        WHERE role = 'admin';
      `;
      const resAdmin = await client.query(adminText);
      let dynRole = 'user';
      if (resAdmin.rows.length < 1) dynRole = 'admin';
      //~~~~~~~~~~~~~~~~~~~~~~~~~
      //  Create User

      const userText = `
        INSERT INTO tbl_user(name, email, password, role) 
        VALUES($1, $2, $3, $4) 
        RETURNING id, name, role`;
      const userValues = [username, email, pwCrypt, dynRole];
      const resUser = await client.query(userText, userValues);
      console.log('>INSERT\n', resUser.rows[0]);
      const userId = resUser.rows[0].id;
      //~~~~~~~~~~~~~~~~~~~~~~~~~
      //  Create Profile
      const profText = `
       INSERT INTO tbl_profile(user_id) 
       VALUES($1) `;
      const profValues = [userId];
      const resProf = await client.query(profText, profValues);

      if (resAdmin.rows.length > 0) {
        const conorId = resAdmin.rows[0].id;
        console.log('>conorId: ', conorId);
        //  Create Chat
        const chatText = `
            INSERT INTO tbl_talk(type)
            VALUES($1)
            RETURNING id;
      `;
        const resChat = await client.query(chatText, ['chat']);
        const chatId = resChat.rows[0].id;
        console.log('>CHAT');

        //  Create Access
        const accessText = `
            INSERT INTO tbl_access(user_id, talk_id)
            VALUES
                ($1, $2),
                ($3, $2);
      `;
        await client.query(accessText, [userId, chatId, conorId]);
        console.log('>ACCESS');

        //  Create History
        const initText = `
            INSERT INTO tbl_talk_history(talk_id, send_id, body, edit_note)
            VALUES($1, $2, $3, $4)
            RETURNING date_time, edit_note;
      `;
        //  timestamp: 2020-07-17 05:17:13.484683-07
        const body = {
          type: 'chat',
          text: `Hello ${username}, glad you could make it. (^=^)`,
        };

        const resInit = await client.query(initText, [
          chatId,
          conorId,
          body,
          'init',
        ]);
        console.log('>HISTORY INIT \n', resInit.rows[0]);

        //  New Chat Notification
        if (resInit.rows[0].edit_note === 'init') {
          // some email notification
        }
        //  New Admin WARNING
        if (resUser.rows[0].role === 'admin') {
          // some email notification
        }
      }
      //~~~~~~~~~~~~~~~~~~~~~~
      //  Return JWT
      const payload = {
        user: {
          id: userId,
        },
      };
      jwt.sign(payload, shhh, { expiresIn: 1800 }, (err, token) => {
        if (err) throw err;
        response
          .json({ token: token, user: { userName: username } })
          .redirect('/talk');
      });
      console.log('>JWT');
      await client.query('COMMIT');
      console.log('(^=^) REGISTER USER > DONE');
      //~~~~~~~~~~~~~~~~~~~~~
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
  }
);

//============================================================
//  TESTING     TESTING     TESTING     TESTING
//============================================================

//  TEST ROUTE NO DB
//  @route      GET api/auth/sars
//  @desc       respond "Oh, hello there."
//  @access     PUBLIC
router.get('/sars', async (request, response, next) => {
  const testString = 'oh, hello there.';
  //  Response
  return response.status(200).send(testString);
});

//  TEST ROUTE with DB
//  @route      GET api/auth/db
//  @desc       respond "list of all users"
//  @access     PUBLIC
router.get('/db', async (request, response, next) => {
  const queryText = `
    SELECT 
      name,
      role
    FROM tbl_user;
    `;
  try {
    const res = await pool.query(queryText);
    //  Response
    return response.status(200).json(res.rows);
  } catch (err) {
    console.error('(._.) test.js > catch > err: ' + err);
    response.status(500).send('Server error');
    return next(err);
  }
});

//============================================================
//-----------------------------------------------------------------
//  Catch-All Error Function
router.use((err, req, res, next) => {
  console.log('User.js > ENTER NEXT ERR FXN > err:\n', err);
  res.status(500).json(err);
});

module.exports = router;
