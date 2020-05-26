const path = require('path');

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const docs = require('./controllers/document');
const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
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

app.get('/api/products', (req, res) => {
  res.sendFile(path.join(__dirname, 'data', 'products.json'));

});
app.post('/api/checkout', (req, res, next) => {
  try{
  docs.insertCheckout(req.body.key, req.body.items);
  res.status(200).send(req.body.key);
  }catch(ex){
    console.log(ex);
  }
  next();
});
app.get('/api/checkout/:key', async (req, res, next) => {
  try {
    
  let obj= await docs.getCheckout(req.params.key);
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
