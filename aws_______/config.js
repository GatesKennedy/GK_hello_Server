const {
  AWS_MAXKEYS,
  AWS_REGION,
  GK_ACCESS_KEY_ID,
  GK_SECRET_ACCESS_KEY,
  AWS_API_S3,
  GK_S3_TALK,
  GK_S3_USER,
} = process.env;

// Create the credentials obj parameters
const gkCred = {
  accessKeyId: GK_ACCESS_KEY_ID,
  secretAccessKey: GK_SECRET_ACCESS_KEY,
  apiVersion: AWS_API_S3,
};
// Create the parameters for calling listObjects
const gkBuckParams = {
  MaxKeys: AWS_MAXKEYS,
  CreateBucketConfiguration: {
    LocationConstraint: AWS_REGION,
  },
};

module.exports = {
  gkCred,
  gkBuckParams,
};
