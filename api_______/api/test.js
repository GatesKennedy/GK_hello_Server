const express = require('express');
const router = express.Router();
//  MID
const cors = require('cors');
const pool = require('../../db_______/db');
const { validateToken } = require('../middleware/auth');
//-----------
const { NODE_ENV } = process.env;

//  TEST
//  @route      GET api/test
//  @desc       Test Response
//  @access     PUBLIC
router.get('/', (req, res, next) => {
  res.json({ msg: `Good for ${NODE_ENV}...` });
});

router.get('/db-async', async (request, response, next) => {
  console.log('(^=^) Enter FXN > GET: api/test/db-async');
  //  Async db Connection
  const client = await pool.connect();
  try {
    const queryText = `
      SELECT
      *
      FROM tbl_user 
      LIMIT 1
  `;
    const { rows } = await client.query(queryText);
    await client.query('COMMIT');
    // Successful Response
    response.status(200).json(rows);
  } catch (err) {
    const errStr = JSON.stringify(err);
    console.log(
      '|     (>_<) api/test/db-async > FAIL Catch > errStr: ',
      errStr
    );
    await client.query('ROLLBACK');
    return next(err);
  } finally {
    client.release();
  }
});

module.exports = router;
