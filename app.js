const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const docs = require('./controllers/document');
const fileUpload = require('express-fileupload');
const app = express();
var unzip = require('unzip');
var moment = require('moment');
var AWS = require('aws-sdk');
var AdmZip = require('adm-zip');
let Readable = require('stream').Readable;
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

function unzipFiles(file, folder) {
  const stream = new Readable();
  return new Promise((resolve, reject) => {
    stream.push(file.data);
    stream.push(null);
    try {
      stream.pipe(unzip.Extract({
        path: folder 
      }));
      setTimeout(() => {
        resolve();
      }, config.UNZIP_MAX_TIME);
    } catch (ex) {
      reject(ex);
    }
  })
}

// function unzipFiles(zipfilename, folder, sku) {

//   return new Promise((resolve, reject) => {

//     try {
    
//       var zip = new AdmZip(zipfilename);
//       var zipEntries = zip.getEntries(); // an array of ZipEntry records
//       let names = [];
//       zipEntries.forEach(function (zipEntry) {
//         names.push(zipEntry.entryName);
//         console.log(zipEntry.getData())
//       });
//       zip.extractAllTo(folder, /*overwrite*/ true);
//       let index = 1;
//       names.forEach(name => {
//         let new_name = '';
//         if (name.indexOf('thumbnail') > 0) {
//           new_name = sku + "_2" + name;
//         } else {
//           new_name = sku + "_" + index + name;
//         }
//         if (index == 1) index = index + 2;
//         else index++;

//         fs.rename(folder + "/" + name, folder + "/" + new_name, function (err) {
//           if (err) console.log('ERROR: ' + err);
//         });
//       })

//       setTimeout(() => {
//         resolve();
//       }, config.UNZIP_MAX_TIME);
//     } catch (ex) {
//       console.log('zip error')
//       console.log(ex);
//       reject(ex);
//     }
//   })
// }

async function upload(req, res) {
  let sku = await docs.getNextSku();
  console.log(req.files)
  let file = req.files.file;
  let zipfilename = __dirname + '/public/' + file.name;
  fs.writeFile(zipfilename, file.data, function (err, data) {
    if (err) {
      return console.log(err);
    }
    if (req.query.sku) sku = req.query.sku;
    let folder = __dirname + '/public/static/media/';
    res.status(200).json({
      sku: sku
    });
 var mediapath = __dirname + '/public/';
    unzipFiles(file, mediapath).then(function () {
     
      exec(`
    aws s3 sync ${mediapath}  s3://${config.CONTENT_S3_BUCKET}/
    `, (error, stdout, stderr) => {
        if (error) {
          console.log(error.stack);
          console.log('Error code: ' + error.code);
          console.log('Signal received: ' + error.signal);
        }

        exec('rm -rf ' + folder, function (error2, stdout2, stderr2) {
          if (error2) {
            console.log(error2.stack);
            console.log('Error code: ' + error2.code);
            console.log('Signal received: ' + error2.signal);
          }
          console.log('file moved to s3 ');
        })
      })
    }).catch((exception) => {
      console.log(exception)
    });
  });



}
