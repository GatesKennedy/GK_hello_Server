//  EXPRESS
const express = require('express');
const router = express.Router();
//  FXNs
const { CheckCred, ListBuckets } = require('../utils/aws_inspect');

//  =============
//  ==   GET   ==
//  =============

//  TEST ROUTE NO DB
//  @route      GET api/test
//  @desc       respond "Oh, hello there."
//  @access     PUBLIC
router.get('/', async (request, response, next) => {
  try {
    const cred = CheckCred();
    const buck = ListBuckets();
    const awsStr = `
    oh, hello there.
    </br>
    ${cred}
    </br>
    ${buck}`;
    //  Response
    response.status(200).send(awsStr);
    return;
  } catch (err) {
    console.error('(>_<) aws.js > catch > err: ', err);
    response.status(500).send('Server error');
    return next(err);
  }
});

router.use((err, req, res, next) => {
  res.json(err);
});

module.exports = router;
