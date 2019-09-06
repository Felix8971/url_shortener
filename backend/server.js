
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

app.get('/', function (req, res) {
  console.log('Hello !');
});

//Redirect the user to the corresponding url when he tries to access the tiny url
app.get('/:s', function (req, res) {
  let shortUrl = req.params.s;
  Data.find({shortUrl}, (err, data) => {
    if (err) return res.json({ success: false, error: err });
    if (data && data.length === 1){
      res.redirect(data[0].url);
    } else{
      console.log("shortUrl doesnt exist");
      return res.json({ success: false });
    }
  });
});

// fetches all available data in our database
// router.get('/getData', (req, res) => {
//   Data.find((err, data) => {
//     if (err) return res.json({ success: false, error: err });
//     return res.json({ success: true, data: data });
//   });
// });

var getShortUrl = () => { return Math.random().toString(36).substring(7); }

// adds new element in our database
router.post('/putData', (req, res) => {
  const { url, customShortUrl } = req.body;
  // if ((!id && id !== 0) || !url ) {
  //   return res.json({
  //     success: false,
  //     error: 'INVALID INPUTS',
  //   });
  // }
  
  //If shortUrl doesn't exist in database we create a new document 
  let customUrl = customShortUrl === null ? '' : customShortUrl.trim();
  let shortUrl = customUrl || getShortUrl();
  Data.find({shortUrl}, (err, data) => {
    if (err) return res.json({ success: false, error: err });
    if (data && data.length === 0){
      //Save in database
      let _data = new Data(); 
      _data.url = url;
      _data.shortUrl = shortUrl;
      //_data.id = id;
      console.log('_data=',_data);
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
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));