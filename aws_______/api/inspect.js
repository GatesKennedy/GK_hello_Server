const { Router } = require('express');
const {
  CheckCred,
  ListBuckets,
  ListObjectSingle,
  ListObjectsData,
  ListObjectsKey,
  KeepListing,
} = require('../utils/aws_inspect');

const router = Router();

//  ~ Routes ~

//  =============
//  ==   GET   ==
//  =============

//  @route      GET /api/aws/inspect
//  @desc       List Buckets from S3
//  @access     PUBLIC
router.get('/bucket', async (request, response, next) => {
  //  @route      GET /api/library/artist/:name
  //  const { name } = request.params;

  //  @route      GET /api/library/filter/result
  //  const { offset, orderType } = request.query;

  try {
  } catch (err) {
    console.log('(-_-) /api/aws/inspect/bucket > FAIL' + err.message);
    return next(err);
  }
});

//  Catch-All Error Function
router.use((err, request, response, next) => {
  console.log('Next FXN Error response');
  response.json(err);
});

module.exports = router;
