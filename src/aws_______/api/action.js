const { Router } = require('express');
const router = Router();
const fs = require('fs');
const AWS = require('aws-sdk');
const cors = require('cors');

//  AWS
const { AWS_API_S3, AWS_REGION, AWS_MAXKEYS } = process.env;
const { gkCred, gkBuckParams } = require('../config');
//  FXN
const { makeImgStr } = require('../utils/fxn');

//  ===============
//  ==   /util   ==
//  ===============
//  @route      POST /api/aws/utils/
//  @desc       Upload File to S3
//  @access     !!!PRIVATE
router.post('/utils/:name', async (req, res, next) => {
  const { name } = req.params;
  const params = gkBuckParams;
  params.Bucket = name;

  const s3 = new AWS.S3(gkCred);
  try {
    await s3.createBucket(params, function (err, data) {
      if (err) {
        console.log('(>_<) aws Error: ', err, err.stack);
        res.error(err).status(500);
      } else if (data) {
        console.log(`Bucket ${name} Created Successfully`, data.Location);
        res.json(data).status(200);
      } else {
        console.log('(-_-) ...eh \n \n');
      }
    });
  } catch (err) {
    res.next(err);
  }
});

//  ===============
//  ==   /root   ==
//  ===============

//  @route      POST /api/aws/action/
//  @desc       Upload File to S3
//  @access     !!!PRIVATE
router.post('/action/', cors(), async (req, res, next) => {
  console.log('(^=^) /api/aws/action/ > req.files: \n', req.files);
  console.log('(^=^) /api/aws/action/ > req.body: \n', req.body);

  if (!req.files) {
    console.log('(^=^) POST /api/aws/action/ > FAIL > No Files');
    res.status(500).json({ status: false, message: 'oops.. No files' });
  }

  const { image } = req.files;
  const { artist, type, buckName } = req.body;
  const fileSrc = image.tempFilePath;
  const keyStr = makeImgStr(image.name, artist, type);

  // Create S3 service object
  const s3 = new AWS.S3({
    apiVersion: AWS_API_S3,
    region: AWS_REGION,
    credentials: gkCred,
  });
  //  TRIG
  let trgFs = false;
  // Create readStream
  const readStream = fs.createReadStream(fileSrc);
  readStream.on('open', function () {
    console.log('(>_<) UploadObject() > readStream Opened');
  });
  readStream.on('error', function (err) {
    console.log('(>_<) UploadObject() > readStream Error', err);
    return res
      .status(500)
      .json({ status: false, message: 'oops.. readStream Error' });
  });
  readStream.on('close', () => {
    console.log('(>_<) UploadObject() > readStream Closed');
    trgFs = true;
  });
  //  Create Params
  const objParams = {
    ACL: 'public-read',
    Body: readStream,
    Bucket: buckName,
    Key: keyStr,
  };
  //  AWS FXN
  s3.upload(objParams, function (err, data) {
    if (err) {
      console.log(`(>_<) POST /api/aws/action/ > s3.upload() > FAIL
        ERROR:\n   ${err}`);
      return res
        .status(500)
        .json({ status: false, message: 'oops.. AWS error' });
    }
    if (data) {
      console.log(
        `(^=^) POST /api/aws/action/ > s3.upload() > DONE
        DATA:\n `,
        data
      );
      return res
        .status(200)
        .json({ status: true, message: 'Success! File Received' });
    }
  });
  //  RESPONSE
  if (trgFs) console.log('trgFs:', trgFs);
});

//  =================
//  ==   /stream   ==
//  =================

module.exports = router;
