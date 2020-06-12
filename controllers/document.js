const config = require('../config')();
var moment = require('moment');
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
module.exports.removePhoto = async (imgurl) => {
  var product;
  return new Promise(async (resolve, reject) => {
    try {
      product = await getProduct(sku);
    } catch (ex) {
      return reject(ex)
    }
    if (product) {
      if (product.imageUrl) {
        product.images = product.images.filter(url => url != imgurl);
        try {
          await updateProduct(product);
        } catch (ex) {
          return reject(ex);
        }
        resolve(true)
      }
    }
  });
}
module.exports.removeProduct = function removeProduct(sku) {
  return new Promise((resolve, reject) => {
    var url = config.MONGO_URL;
    MongoClient.connect(url, {

    }, async function (err, client) {
      if (!err) {
        console.log(sku)
        var db = client.db(config.MONGO_DB);
        try {
          db.collection('products').remove({
             "sku": parseInt(sku)
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
module.exports.getProduct = function getProduct(sku) {
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

module.exports.updateProduct = function updateProduct(product) {
  return new Promise((resolve, reject) => {
    var url = config.MONGO_URL;
    product.updated_at = moment().format();
    MongoClient.connect(url, {

    }, async function (err, client) {
      if (!err) {
        var db = client.db(config.MONGO_DB);
        try {
          db.collection('products').update({
              "sku": product.sku
            },
            product, {
              "multi": false, // update only one document 
              "upsert": false // insert a new document, if no existing document match the query 
            }
          );

        } catch (e) {
          console.log(e)
          reject(e);
        }
        return resolve();

      } else {
        return reject(err);
      }
    });
  });
}

module.exports.getNextSku = () => {
  return new Promise((resolve, reject) => {
    var url = config.MONGO_URL;
    MongoClient.connect(url, {}, async function (err, client) {
      if (!err) {
        try {
          var db = client.db(config.MONGO_DB);
          let cursor = db.collection("products").find().sort({
            sku: -1
          }).limit(1);
          let nextSku = 0;
          cursor.each(async function (err2, doc) {
            if (err2) {
              console.log('error 2');
              console.log(err2);
              return reject(err2);
            }
            if (doc) {
              nextSku = parseInt(doc.sku) + 1;
              db.collection("products").insertOne({
                sku: nextSku,
                name: 'New Product',
                created_at: moment().format(),
                updated_at: moment().format()
              });
              return resolve(nextSku);
            }

            db.collection("products").insertOne({
              sku: 100001,
              name: 'New Product'
            });
            return resolve(100001); //start from 100001
          })
        } catch (e) {
          console.log('error 1');
          console.log(e)
          reject(e)
        }

      } else {
        return reject(err);
      }
    });
  });
}
module.exports.insertCategory = (item) => {
  return new Promise((resolve, reject) => {
    var url = config.MONGO_URL;
    MongoClient.connect(url, {

    }, async function (err, client) {
      if (!err) {
        var db = client.db(config.MONGO_DB);
        try {
          db.collection("categories").insertOne(item);
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
          let cursor = db.collection("products").find({
            "category_id": {
              $ne: null
            }
          });
          let docs = [];
          cursor.each(async function (err2, doc) {
            if (err2) {
              console.log('error 2');
              console.log(err2);
              return reject(err2);
            }
            if (doc) {
              docs.push(doc);
            } else {
              return resolve(docs);
            }
          })
        } catch (e) {
          console.log('error 1');
          console.log(e)
          reject(e)
        }

      } else {
        return reject(err);
      }
    });
  });
}
module.exports.getAllCategories = () => {
  return new Promise((resolve, reject) => {
    var url = config.MONGO_URL;
    MongoClient.connect(url, {

    }, async function (err, client) {
      if (!err) {
        var db = client.db(config.MONGO_DB);
        try {
          let cursor = db.collection("categories").find({});
          let docs = [];
          cursor.each(async function (err2, doc) {
            if (err2) {
              console.log('error 2');
              console.log(err2);
              return reject(err2);
            }
            if (doc) {
              docs.push(doc);
            } else {
              return resolve(docs);
            }
          })
        } catch (e) {
          console.log('error 1');
          console.log(e)
          reject(e)
        }

      } else {
        return reject(err);
      }
    });
  });
}