//app/index.js
var express = require('express');

var router = express.Router();


router.get('/', (req, res, next) => {
  res.render('home', {
    pageTitle: "PHOTO ALBUM"
  });
});

router.get('/home', (req, res, next) => {
  res.render('home', {
    pageTitle: "PHOTO ALBUM"
  });
});

router.get('/memes', (req, res, next) => {
  res.render('memes', {
    pageTitle: "MEMES"
  });
});

router.get('/heroes', (req, res, next) => {
  res.render('heroes', {
    pageTitle: "HEROES"
  });
});

router.get('/NDT-Tweets', (req, res, next) => {
  res.render('NDT-Tweets', {
    pageTitle: "NDT TWEETS"
  });
});

router.get('/login', (req, res, next) => {
  res.render('login', {
    pageTitle: "LOGIN"
  });
});

router.get('/upload', (req, res, next) => {
  res.render('upload', {
    pageTitle: "UPLOAD"
  });
});

router.get('/register', (req, res, next) => {
  res.render('register', {
    pageTitle: "REGISTER"
  });
});

//tested the route to ensure it works
/*router.get('/info', (req, res, next) => {
  res.send('Test page');
});*/


//turns router into module
module.exports = router;
