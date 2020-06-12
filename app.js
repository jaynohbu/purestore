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
  
  docs.getAllProducts().then((prods) => {
    console.log('prods' + prods.length)
    res.status(200).send({
      products: prods
    });
  })

});
app.get('/api/categories', (req, res) => {
  console.log('/api/categories');
   res.status(200).send({
     categories: [{
       text: "Health",
       value: 1
     }]
   });
  // docs.getAllCategories().then((cats) => {
  //   console.log('categories' + cats.length)
   
  // })

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
app.delete('/api/photo', (req, res, next) => {
  try {
    docs.removePhoto(req.query.name);
    res.status(200).send();
  } catch (ex) {
    console.log(ex);
  }
  next();
});
app.delete('/api/product', (req, res, next) => {
  try {
    docs.removeProduct(req.body.sku);
    res.status(200).send();
  } catch (ex) {
    console.log(ex);
  }
  next();
});
app.put('/api/product', (req, res, next) => {
  try {
    delete req.body.product._id;
    docs.updateProduct(req.body.product);
    res.status(200).send();
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
  var sku=req.query.key;
  if (!sku )
  sku = await docs.getNextSku();
  console.log(req.files)
  let file = req.files.file;
  let new_name = '';
  new_name = sku + `_${moment().unix()}.` + file.name;
  let folder = __dirname + '/public/static/products/';
  let path = folder + new_name;
  fs.writeFile(path, file.data, function (err) {
    if (err) {
      return console.log(err);
    }
    if (req.query.sku) sku = req.query.sku;
   
    let local_path = __dirname + '/public';
    exec(` aws s3 sync ${local_path}  s3://${config.CONTENT_S3_BUCKET}/ --profile puresmoke`, (error, stdout, stderr) => {
      if (error) {
        console.log(error.stack);
        console.log('Error code: ' + error.code);
        console.log('Signal received: ' + error.signal);
      }
        console.log('file moved to s3 ');
         res.status(200).json({
           sku: sku,
           path: config.CONTENT_S3_BUCKET_IMG_PATH+ new_name
         });
      });
    });
}
