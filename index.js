require('dotenv').config();
const express = require('express');
const bp = require('body-parser');
const mongoose = require('mongoose');
const expressJWT = require('express-jwt');
const auth = require('./routes/auth');
const locked = require('./routes/locked');
const RateLimit = require('express-rate-limit');
const api = require('./routes/api');

const app = express();
// This line lets us accept POST data from axios
app.use(bp.json());
app.use(bp.urlencoded({extended: false}));

// mongoose.connect('mongodb://localhost/jwtAuth');
require('./config/database')

app.use(express.static(__dirname + "/client/build"));

var loginLimiter = new RateLimit({
  windowMs: 5*60*1000, // 5 minutes
  max: 3,
  delayMs: 0, // disabled
  message: "Maximum login attempts exceeded. Please try again later."
});

var signupLimiter = new RateLimit({
  windowMs: 60*60*1000, // 60 minutes
  max: 3,
  delayMs: 0, // disabled
  message: "Maximum accounts created. Please try again later."
});

app.use('/auth/login', loginLimiter);
app.use('/auth/signup', signupLimiter);

app.use('/api', api)
app.use('/auth', auth);
// This line uses the express-jwt node module to protect the routes
app.use('/locked', expressJWT({secret: process.env.JWT_SECRET}).unless({method: 'POST'}), locked);

// something in here ?
// app.use(express.urlencoded({extended: true}));
// app.use(express.json());
// app.use(require('method-override')('_method'));

// app.use('/api/parks', require('./routes/api'));




app.get('*', (req, res) => {
  res.sendFile(__dirname + "/client/build/index.html");
});



var port = process.env.PORT || 3001;

var server = app.listen(port, () => {
  console.log(`Server listening on port: ${port}`)
});

module.exports = server;
