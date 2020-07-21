//  EXPRESS
const express = require('express');
const router = express.Router();
//  MID
// const pool = require('../nds_db/db');

//  =============
//  ==   GET   ==
//  =============

//  TEST ROUTE NO DB
//  @route      GET api/test
//  @desc       respond "Oh, hello there."
//  @access     PUBLIC
router.get('/sars', async (request, response, next) => {
  const testString = 'oh, hello there.';
  //  Response
  return response.status(200).send(testString);
});

//  TEST ROUTE with DB
//  @route      GET api/test
//  @desc       respond "list of all artists"
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

router.use((err, req, res, next) => {
  res.json(err);
});

module.exports = router;
