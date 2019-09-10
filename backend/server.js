
var http = require('http');
const express = require('express');
//const https = require('https');
//const fs = require('fs');
const helmet = require('helmet')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const logger = require('morgan');
const Data = require('./data');
const API_PORT = 3001;

const dbRoute = require("./secret");
var cors = require('cors');

const app = express();

app.use(helmet());
app.use(cors());
const router = express.Router();

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

app.get('/', (req, res) => {
  res.send('Hello World');
});

//Redirect the user to the corresponding url when he tries to access a tiny url
app.get('/:s', function (req, res) {
  let shortUrl = req.params.s;
  console.log('shortUrl=',shortUrl);
  Data.find({shortUrl}, (err, data) => {
    if (err) return res.json({ success: false, error: err });
    if (data && data.length === 1){
      console.log('redirect');
      res.redirect(data[0].url);
    } else{
      console.log("shortUrl doesnt exist");
      return res.json({ success: false });
    }
  });
});

var getShortUrl = () => { return Math.random().toString(36).substring(7); }

//Create a new short url, adds new element in database and return short url to client
router.post('/putData', (req, res) => {
  const { url, customShortUrl } = req.body;

  //Verify url and customShortUrl format
  const pattern_url = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
  if ( !pattern_url.test(url) ) {
    return res.json({
      success: false,
      msg: 'Please enter a valid url',
    });
  }
  if ( url.length >= 2000 ) {
    return res.json({
      success: false,
      msg: 'url must be less than 2000 characters',
    });
  }
  
  let customUrl = customShortUrl === null ? '' : customShortUrl.substr(0, 50).trim();
  const pattern_alias = /([\da-z\.-]+)([\/\w \.-]*)*\/?$/;
  if ( customUrl && !pattern_alias.test(customUrl) ) {
    return res.json({
      success: false,
      msg: 'Please enter a valid custom alias',
    });
  }
  let shortUrl = customUrl || getShortUrl();

  //If shortUrl doesn't exist in database we create a new document 
  Data.find({shortUrl}, (err, data) => {
    if (err) return res.json({ success: false, error: err });
    if (data && data.length === 0){
      //Save in database
      let _data = new Data(); 
      _data.url = url;
      _data.shortUrl = shortUrl;
      //console.log('_data=',_data);
      _data.save((err) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ 
          success: true, 
          shortUrl: 'http://localhost:'+API_PORT+'/'+shortUrl,
        });
      });
    } else {
      let msg = 'Sorry, this url already exists in the database !';
      console.log(msg);
      return res.json({ success: false, msg });
    }
  });
});

// append /api for our http requests
app.use('/api', router);


// launch our backend into a port
var httpServer = http.createServer(app);
httpServer.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));

//var httpsServer = https.createServer(options, app);
//httpsServer.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
// https.createServer({
//   key: fs.readFileSync('./key.pem'),
//   cert: fs.readFileSync('./cert.pem'),
//   passphrase: 'hello'
// }, app)
// .listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));