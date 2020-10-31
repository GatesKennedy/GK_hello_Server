//  EXPRESS
const express = require('express');
const { check, validationResult } = require('express-validator');
//  Socket.io
//  MID
const auth = require('../middleware/auth');
const { validateToken } = require('../middleware/auth');
const pool = require('../../db_______/db');
//  ENV

const router = express.Router();
//  ===============
//  ==   /       ==
//  ===============

//  LOAD TALK ACCESS
//  @route      GET api/chat/
//  @desc       AUTH Token | LOAD User Chats
//  @access     PRIVATE
router.get('/', validateToken, async (request, response, next) => {
  console.log('(^=^) GET: api/chat/ > LOAD CHATS >  Enter FXN');
  const id = request.user.id;
  const queryText = `
  WITH tbl_members AS (
    SELECT
      json_build_object(
        'name', tU.name,
        'id', tU.id
      ) AS member,
      tA.talk_id AS talk_id
    FROM tbl_user tU
    INNER JOIN tbl_access tA
      on tA.user_id = tU.id
  )
  SELECT 
    tT.id,
    tt.type,
    tt.seen,
    array_agg( tM.member ) AS members
  FROM tbl_members tM
  INNER JOIN tbl_talk tT 
    on tT.id = tM.talk_id
  INNER JOIN tbl_access tA
    on tA.talk_id = tM.talk_id
  INNER JOIN tbl_user tU
    on tU.id = tA.user_id
  WHERE 
    tA.user_id = '${id}'
  GROUP BY 
    tT.id,
    tT.type,
    tT.seen
  ;`;
  try {
    const { rows } = await pool.query(queryText);
    console.log(`|    GET: api/chat/ > rows: `, rows);
    response.status(200).json(rows);
  } catch (err) {
    console.error('(>_<) GET: api/chat/ > LOAD CHATS > catch: ' + err.message);
    return next(err);
  }
});

//  POST Talk Chat Message
//  @route      POST api/chat/
//  @desc       AUTH User | POST Chat Message
//  @access     PRIVATE
router.post('/', validateToken, async (request, response, next) => {
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
//  ===============
//  ==   /hist   ==
//  ===============

//  LOAD CHAT
//  @route      GET api/chat/hist
//  @desc       AUTH Token | LOAD User Chats
//  @access     PRIVATE
router.get('/history', validateToken, async (request, response, next) => {
  console.log('(^=^) GET: api/chat/history >  Enter FXN');
  const id = request.user.id;
  const queryText = `
    WITH tbl_msgs AS (
        SELECT 
            json_build_object(
                'id', tH.id,
                'body', tH.body,
                'send_id', tH.send_id, 
                'seen', tH.seen,
                'date_time', tH.date_time
            ) AS msgObj,
            tH.talk_id AS talk_id
        FROM tbl_talk_history tH
        INNER JOIN tbl_access tA
            on tA.talk_id = tH.talk_id
        WHERE tA.user_id = '${id}'
        )
    SELECT
        talk_id,
        array_agg(
          msgObj
          ORDER BY msgObj->>'date_time'
          ) AS msgObj
    FROM tbl_msgs 
    GROUP BY talk_id
    
    ;
    `;
  try {
    const { rows } = await pool.query(queryText);
    response.status(200).json(rows);
  } catch (err) {
    console.error('(>_<) GET: api/chat/ > LOAD CHATS > catch: ' + err.message);
    return next(err);
  }
});

//  LOAD CHAT
//  @route      GET api/chat/hist
//  @desc       AUTH Token | LOAD User Chats
//  @access     PRIVATE
router.post('/hist', validateToken, async (request, response, next) => {
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

//  ==============
//  ==   POST   ==
//  ==============

module.exports = router;
