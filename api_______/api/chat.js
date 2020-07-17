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

//  LOAD CHAT
//  @route      GET api/chat/
//  @desc       AUTH Token | LOAD User Chats
//  @access     PRIVATE
router.get('/', auth, async (request, response, next) => {
  console.log('(^=^) GET: api/chat/ > LOAD CHATS >  Enter FXN');
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
//  @route      POST api/chat/
//  @desc       LOGIN-AUTH User | GET Token
//  @access     PRIVATE
router.post('/', auth, async (request, response, next) => {
  console.log('(^=^) GET: api/chat/ > POST CHAT >  Enter FXN');
  const { id, talkId, body } = request.body;
  const queryText = `
      INSERT (body, send_id)
      VALUES (${body}, ${id}) 
      INTO tbl_talk_history
      WHERE talk_id = ${talkId}
      `;
  try {
    response.status(200).json(rows[0]);
  } catch (err) {
    console.error('(>_<) GET: api/chat/ > LOAD CHATS > catch: ' + err.message);
    return next(err);
  }
});

//-----------------------------------------------------------------
//  Catch-All Error Function
router.use((err, req, res, next) => {
  res.json(err);
});

module.exports = router;
