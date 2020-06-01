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

function unzipFiles(file, folder, sku) {

  return new Promise((resolve, reject) => {

    try {
      if (!file.data) return reject('no data');
      var zip = new AdmZip(file.data);
      var zipEntries = zip.getEntries(); // an array of ZipEntry records
      let index = 1;
      zipEntries.forEach(function (zipEntry) {
        let name='';
        if (zipEntry.entryName.indexOf('thumbnail') > 0) {
          name = sku + "_" + 2 + "." + zipEntry.name;
       
        } else {
          if (index == 2) index = 3;
           name = sku + "_" + index + "." + zipEntry.name;
          index++;
        }

    const params = {
      Bucket: config.CONTENT_S3_BUCKET,
      Key: 'static/media/'+name, // File name you want to save as in S3
      Body: zipEntry.getData()
    };

    // Uploading files to the bucket
    s3.upload(params, function (err, data) {
      if (err) {
        throw err;
      }
      console.log(`File uploaded successfully. ${data.Location}`);
    });
   
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
  let folder = basePath + '/public/static/media/' ;
  res.status(200).json({
    sku: sku
  });

  unzipFiles(file, folder, sku).then(function () {
    var mediapath = basePath + '/public/';
    // exec(`
    // aws s3 sync ${mediapath}  s3://${config.CONTENT_S3_BUCKET}/
    // `, (error, stdout, stderr) => {
    //   if (error) {
    //     console.log(error.stack);
    //     console.log('Error code: ' + error.code);
    //     console.log('Signal received: ' + error.signal);
    //   }

    //   exec('rm -rf ' + folder, function (error2, stdout2, stderr2) {
    //     if (error2) {
    //       console.log(error2.stack);
    //       console.log('Error code: ' + error2.code);
    //       console.log('Signal received: ' + error2.signal);
    //     }
    //     console.log('file moved to s3 ');
    //   })
    // })
  }).catch((exception) => {
    console.log(exception)
  });


}
