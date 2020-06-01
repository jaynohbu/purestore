const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const docs = require('./controllers/document');
const fileUpload = require('express-fileupload');
const app = express();
var basePath = __dirname + "/..";
var moment = require('moment');
var AWS = require('aws-sdk');
var AdmZip = require('adm-zip');

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

function unzipFiles(file, folder, sku) {

  return new Promise((resolve, reject) => {
  
    try {
      // reading archives
      var zip = new AdmZip(file.data);
      var zipEntries = zip.getEntries(); // an array of ZipEntry records

      zipEntries.forEach(function (zipEntry) {
        console.log(zipEntry.toString()); // outputs zip entries information
      
      });
      zip.extractAllTo(folder, /*overwrite*/ true);
      setTimeout(() => {
        resolve();
      }, config.UNZIP_MAX_TIME);
    } catch (ex) {
      reject(ex);
    }
  })
}

async function upload(req, res) {
  let sku = await docs.getNextSku();
  console.log(req.files)
  let file = req.files.file;
  if (req.query.sku) sku = req.query.sku;
  let folder = basePath + '/public/' + sku;
  res.status(200).json({
    sku: sku
  });

  unzipFiles(file, folder, sku).then(async function () {
    exec(`
    aws s3 sync ${folder}  s3://${config.CONTENT_S3_BUCKET}/static/media/${sku}/
    `).then(async () => {
      exec('rm -rf ' + folder).then(() => {
        console.log('file moved to s3 ');
      })
    });

  })
}