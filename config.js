console.log("process.env.NODE_ENV:" + process.env.NODE_ENV);
module.exports = function () {
  switch (process.env.NODE_ENV) {
    case 'dev':
      return {
        MONGO_URL: 'mongodb://localhost:27017',
          MONGO_DB: 'puregoods',
          CONTENT_S3_BUCKET: 'www.puregoodsnow.com',
            CONTENT_S3_BUCKET_IMG_PATH: 'http://www.puregoodsnow.com.s3-website-us-west-2.amazonaws.com/static/products/',
          LMS_S3: {
               "aws_access_key_id": "AKIA44NUVTGCODXT5KXP",
               "aws_secret_access_key": "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",
               "region": "us-west-2"
          },
          UNZIP_MAX_TIME:5000
      };
    case 'production':
      return {
        MONGO_URL: 'mongodb://localhost:27017',
          MONGO_DB: 'puregoods',
          CONTENT_S3_BUCKET: 'www.puregoodsnow.com',
          CONTENT_S3_BUCKET_IMG_PATH: 'http://www.puregoodsnow.com.s3-website-us-west-2.amazonaws.com/static/products/',
          LMS_S3: {
               "aws_access_key_id": "AKIA44NUVTGCODXT5KXP",
               "aws_secret_access_key": "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",
            "region": "us-west-2"
          },
          UNZIP_MAX_TIME: 5000
      };
    default:
      return {
        MONGO_URL: 'mongodb://localhost:27017',
          MONGO_DB: 'puregoods',
          CONTENT_S3_BUCKET: 'www.puregoodsnow.com',
            CONTENT_S3_BUCKET_IMG_PATH: 'http://www.puregoodsnow.com.s3-website-us-west-2.amazonaws.com/static/products/',
          LMS_S3: {
            "aws_access_key_id": "AKIA44NUVTGCODXT5KXP",
            "aws_secret_access_key": "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",
            "region": "us-west-2"
          },
          UNZIP_MAX_TIME: 5000

      };
  }
};
