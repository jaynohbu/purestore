const config = require('../config')();
var MongoClient = require('mongodb').MongoClient;
module.exports.insertCheckout = (key, items) => {
  return new Promise((resolve, reject) => {
    var url = config.MONGO_URL;
    MongoClient.connect(url, {

    }, async function (err, client) {
      if (!err) {
        var db = client.db(config.MONGO_DB);
        try {
          db.collection("checkouts").insertOne({
            key: key,
            items: items
          });
          resolve()
        } catch (e) {
          reject(e)
        }

      } else {
        return reject(err);
      }
    });
  });
}
module.exports.getCheckout = (key) => {
  return new Promise((resolve, reject) => {
    var url = config.MONGO_URL;
    MongoClient.connect(url, {

    }, async function (err, client) {
      if (!err) {
        var db = client.db(config.MONGO_DB);
        try {
          let cursor = db.collection("checkouts").find({
            "key": `${key}`
          });
          cursor.each(async function (err2, doc) {
            if (err2) {
              return reject(err2);
            }
            if (doc) {
              return resolve(doc);
            } else {
              return resolve(null);
            }
          })
        } catch (e) {
          reject(e)
        }

      } else {
        return reject(err);
      }
    });
  });
}

module.exports.getProduct = (sku) => {
  return new Promise((resolve, reject) => {
    var url = config.MONGO_URL;
    MongoClient.connect(url, {

    }, async function (err, client) {
      if (!err) {
        var db = client.db(config.MONGO_DB);
        try {
          let cursor = db.collection("products").find({
            "sku": `${sku}`
          });
          cursor.each(async function (err2, doc) {
            if (err2) {
              return reject(err2);
            }
            if (doc) {
              return resolve(doc);
            } else {
              return resolve(null);
            }
          })
        } catch (e) {
          reject(e)
        }

      } else {
        return reject(err);
      }
    });
  });
}

module.exports.insertProduct = (item) => {
  return new Promise((resolve, reject) => {
    var url = config.MONGO_URL;
    MongoClient.connect(url, {

    }, async function (err, client) {
      if (!err) {
        var db = client.db(config.MONGO_DB);
        try {
          db.collection("products").insertOne(item);
          resolve()
        } catch (e) {
          reject(e)
        }

      } else {
        return reject(err);
      }
    });
  });
}

module.exports.getAllProducts = () => {
  return new Promise((resolve, reject) => {
    var url = config.MONGO_URL;
    MongoClient.connect(url, {

    }, async function (err, client) {
      if (!err) {
        var db = client.db(config.MONGO_DB);
        try {
          let cursor = db.collection("products").find({});
          cursor.each(async function (err2, doc) {
            if (err2) {
              return reject(err2);
            }
            if (doc) {
              return resolve(doc);
            } else {
              return resolve(null);
            }
          })
        } catch (e) {
          reject(e)
        }

      } else {
        return reject(err);
      }
    });
  });
}