console.log("process.env.NODE_ENV:" + process.env.NODE_ENV);
module.exports = function () {
  switch (process.env.NODE_ENV) {
    case 'dev':
      return {
        MONGO_URL: 'mongodb://34.217.107.94:27017',
          MONGO_DB: 'puregoods',
          CONTENT_S3_BUCKET: 'www.puregoodsnow.com',
          LMS_S3: {
            "aws_access_key_id": "AKIA44NUVTGCC3Y73UOF",
            "aws_secret_access_key": "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",
            "region": "us-west-2"
          }
      };
    case 'production':
      return {
        MONGO_URL: 'mongodb://34.217.107.94:27017',
          MONGO_DB: 'puregoods',
          CONTENT_S3_BUCKET: 'www.puregoodsnow.com',
          LMS_S3: {
            "aws_access_key_id": "AKIA44NUVTGCC3Y73UOF",
            "aws_secret_access_key": "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",
            "region": "us-west-2"
          }
      };
    default:
      return {
        MONGO_URL: 'mongodb://34.217.107.94:27017',
          MONGO_DB: 'puregoods',
          CONTENT_S3_BUCKET: 'www.puregoodsnow.com',
          LMS_S3: {
            "aws_access_key_id": "AKIA44NUVTGCC3Y73UOF",
            "aws_secret_access_key": "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",
            "region": "us-west-2"
          }

      };
  }
};
