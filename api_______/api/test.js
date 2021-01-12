const express = require('express');
const router = express.Router();
const cors = require('cors');
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

module.exports = router;
