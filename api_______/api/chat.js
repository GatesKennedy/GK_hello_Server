//  EXPRESS
const express = require('express');
const { check, validationResult } = require('express-validator');
//  Socket.io
//  MID
const auth = require('../middleware/auth');
const pool = require('../../db_______/db');
//  ENV

const router = express.Router();
//  ===============
//  ==   /talk   ==
//  ===============

//  LOAD TALK ACCESS
//  @route      GET api/chat/
//  @desc       AUTH Token | LOAD User Chats
//  @access     PRIVATE
router.get('/', auth, async (request, response, next) => {
  console.log('(^=^) GET: api/chat/ > LOAD CHATS >  Enter FXN');
  const id = request.user.id;
  const queryText = `
  SELECT 
    tT.id,
    tt.type,
    tt.seen
  FROM tbl_talk tT
  INNER JOIN tbl_access tA
    on tA.talk_id = tT.id 
  WHERE 
    tA.user_id = '${id}'
  ;`;
  try {
    const { rows } = await pool.query(queryText);
    response.status(200).json(rows);
  } catch (err) {
    console.error('(>_<) GET: api/chat/ > LOAD CHATS > catch: ' + err.message);
    return next(err);
  }
});
//  ===============
//  ==   /chat   ==
//  ===============

//  LOAD CHAT
//  @route      GET api/chat/chat
//  @desc       AUTH Token | LOAD User Chats
//  @access     PRIVATE
router.get('/chat', auth, async (request, response, next) => {
  console.log('(^=^) GET: api/chat/ > LOAD CHATS >  Enter FXN');
  const id = request.user.id;
  const queryText = `
  SELECT 
  id,
  body,
  send_id,
  talk_id,
  seen,
  date_time,
  edit_note
  FROM tbl_talk_history
  WHERE 
  talk_id = (
    SELECT talk_id
    FROM tbl_access
    WHERE user_id = '${id}'
    )
  
    ;`;
  try {
    const { rows } = await pool.query(queryText);
    response.status(200).json(rows);
  } catch (err) {
    console.error('(>_<) GET: api/chat/ > LOAD CHATS > catch: ' + err.message);
    return next(err);
  }
});

//  ===============
//  ==   /hist   ==
//  ===============

//  LOAD CHAT
//  @route      GET api/chat/hist
//  @desc       AUTH Token | LOAD User Chats
//  @access     PRIVATE
router.get('/history', auth, async (request, response, next) => {
  console.log('(^=^) GET: api/chat/history >  Enter FXN');
  const { id } = request.body;
  const queryText = `
    SELECT 
        id,
        body,
        send_id,
        talk_id,
        seen,
        date_time,
        edit_note
    FROM tbl_talk_history
    WHERE 
        talk_id = (
            SELECT talk_id
            FROM tbl_access
            WHERE user_id = '${id}'
        );
    `;
  try {
    const { rows } = await pool.query(queryText);
    response.status(200).json(rows);
  } catch (err) {
    console.error('(>_<) GET: api/chat/ > LOAD CHATS > catch: ' + err.message);
    return next(err);
  }
});

//  ==============
//  ==   POST   ==
//  ==============

//  POST CHAT
//  @route      POST api/chat/
//  @desc       AUTH User | POST Chat
//  @access     PRIVATE
router.post('/', auth, async (request, response, next) => {
  console.log('(^=^) GET: api/chat/ > POST CHAT >  Enter FXN');
  const { id, talkId, body } = request.body;
  const queryText = `
      INSERT INTO tbl_talk_history(body, talk_id, send_id)
      VALUES($1, $2, $3) 
      RETURNING body, date_time;
      `;
  try {
    const { rows } = await pool.query(queryText, [body, talkId, id]);
    response.status(200).json(rows);
  } catch (err) {
    console.error('(>_<) GET: api/chat/ > POST CHAT > catch: ' + err.message);
    return next(err);
  }
});

module.exports = router;
