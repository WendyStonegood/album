const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const User = require('./models');
const multer = require('multer');

//look for index.js file in app folder
var photoApp = require('./app/index');

app.set('port', process.env.PORT || 8080);

//serve static items:
app.use(express.static('public'));
app.use(express.static('images'));


//Set up ejs view engine:
app.set('view engine', 'ejs');

// Set The Storage Engine
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file, cb){
    cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Init Upload
const upload = multer({
  storage: storage,
  limits:{fileSize: 1000 * 1000 * 10},
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).single('myImage');

// Check File Type
function checkFileType(file, cb){
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Error: Images Only!');
  }
}

//POST DATA
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

//SESSION
const expressSession = require ('express-session');
app.use(
  expressSession({
    resave:false,
    saveUninitialized: true,
    secret:
    process.env.SESSION_SEC || "alohomora"
  })
);

//FLASH
const flash = require('express-flash-messages');
app.use(flash());

// Connect to Mongoose
mongoose.connect('mongodb://regis:MSSE@ds143362.mlab.com:43362/photoalbumdb', function (err) {
  if (err) throw err;
  console.log('Successfully connected!');
});

// Passport
const passport = require("passport");
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(userId, done) {
  User.findById(userId, (err, user) => done(err, user));
});

// Passport Local
const LocalStrategy = require("passport-local").Strategy;
const local = new LocalStrategy((username, password, done) => {
  User.findOne({ username })
    .then(user => {
      if (!user || !user.validPassword(password)) {
        done(null, false, { message: "Invalid username/password" });
      } else {
        done(null, user);
      }
    })
    .catch(e => done(e));
});
passport.use("local", local);


//connect routes:
app.use('/', photoApp);
app.use("/", require("./routes")(passport));

//upload images to disk:
app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if(err){
      res.render('upload', {
        msg: err
      });
    } else {
      if(req.file == undefined){
        res.render('upload', {
          msg: 'Error: No File Selected!'
        });
      } else {
        res.render('upload', {
          msg: 'File Uploaded!',
          file: `uploads/${req.file.filename}`
        });
      }
    }
  });
});

app.listen(app.get('port'), () => {
  console.log('Photo app party at port ', app.get('port'));
});
