console.log("process.env.NODE_ENV:" + process.env.NODE_ENV);
module.exports = function () {
  switch (process.env.NODE_ENV) {
    case 'dev':
      return {
           MONGO_URL: 'mongodb://34.217.107.94:27017',
             MONGO_DB: 'puregoods'
      };
   
    case 'production':
      return {
           MONGO_URL: 'mongodb://34.217.107.94:27017',
             MONGO_DB: 'puregoods'
      };
    default:
      return {
          MONGO_URL: 'mongodb://34.217.107.94:27017',
          MONGO_DB: 'puregoods'
        
      };
  }
};
