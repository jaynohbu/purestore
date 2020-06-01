const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const docs = require('./controllers/document');
const fileUpload = require('express-fileupload');
const app = express();

var moment = require('moment');
var AWS = require('aws-sdk');

var fs = require('fs');
const {
  exec
} = require("child_process");
const config = require('./config')();
AWS.config.update(config.LMS_S3);
s3 = new AWS.S3();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(fileUpload());
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(cors());
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
})
const port = 8001;
app.post('/api/upload', upload);
app.get('/api/products', (req, res) => {
  console.log('/api/products');
  docs.getAllProducts().then((prods) => {
    console.log('prods' + prods.length)
    res.status(200).send({
      products: prods
    });
  })

});
app.get('/api/categories', (req, res) => {
  console.log('/api/categories');
  docs.getAllCategories().then((cats) => {
    console.log('categories' + cats.length)
    res.status(200).send({
      categories: cats
    });
  })

});
app.post('/api/checkout', (req, res, next) => {
  try {
    docs.insertCheckout(req.body.key, req.body.items);
    res.status(200).send(req.body.key);
  } catch (ex) {
    console.log(ex);
  }
  next();
});
app.get('/api/checkout/:key', async (req, res, next) => {
  try {

    let obj = await docs.getCheckout(req.params.key);
    res.status(200).send({
      items: obj.items
    });

  } catch (ex) {
    console.log(ex);
  }
  next();
});
app.listen(port, () => {
  console.log(`[products] API listening on port ${port}.`);
});



async function upload(req, res) {
  let sku = await docs.getNextSku();
  console.log(req.files)
  let file = req.files.file;
  let new_name = '';
  if (file.name.indexOf('thumbnail') > 0) {
    new_name = sku + "_2." + file.name;
  } else {
    new_name = sku + `_${moment().unix()}.` + file.name;
  }

  let folder = __dirname + '/public/static/media/';
  let path = folder + new_name;
  fs.writeFile(path, file.data, function (err) {
    if (err) {
      return console.log(err);
    }
    if (req.query.sku) sku = req.query.sku;
    res.status(200).json({
      sku: sku,
      path: '/static/media/' + new_name
    });
    let local_path = __dirname + '/public';
    exec(` aws s3 sync ${local_path}  s3://${config.CONTENT_S3_BUCKET}/`, (error, stdout, stderr) => {
      if (error) {
        console.log(error.stack);
        console.log('Error code: ' + error.code);
        console.log('Signal received: ' + error.signal);
      }
        console.log('file moved to s3 ');
      });
    });
}
