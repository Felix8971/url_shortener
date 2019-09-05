
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const logger = require('morgan');
const Data = require('./data');
const API_PORT = 3001;
const app = express();
var cors = require('cors');

app.use(cors());
const router = express.Router();

// our MongoDB database
const dbRoute = 'mongodb+srv://felix8971:C9iWEXNXTLESm14b@cluster0-jprip.mongodb.net/test?retryWrites=true&w=majority'
// connects our back end code with the database
mongoose.connect(dbRoute, { useNewUrlParser: true });

let db = mongoose.connection;

db.once('open', () => console.log('connected to the database'));

// checks if connection with the database is successful
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

//create code to redirect the user to url when he try to acces the tiny url
// router.get('/ssss:id', (req, res) => {
// read shortUrl in database
// redirect the user
// res.redirect(url); ??

// our get method
// this method fetches all available data in our database
router.get('/getData', (req, res) => {
  Data.find((err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

// this is our update method
// this method overwrites existing data in our database
router.post('/updateData', (req, res) => {
  const { id, update } = req.body;
  Data.findByIdAndUpdate(id, update, (err) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});


// adds new data in our database
router.post('/putData', (req, res) => {
  let data = new Data();
 
  const { id, url } = req.body;

  //check if the url doesn't exist in database here

  // .......

   
  if ((!id && id !== 0) || !url ) {
    return res.json({
      success: false,
      error: 'INVALID INPUTS',
    });
  }
  data.url = url;
  data.shortUrl = Math.random().toString(36).substring(5);
  data.id = id;
  console.log('data=',data);
  data.save((err) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });

});

// append /api for our http requests
app.use('/api', router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));