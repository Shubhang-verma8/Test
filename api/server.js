const express = require('express');
const path = require('path');

const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
const session = require('express-session');
const flash = require('req-flash');

const User = require('../models/dbHelper');

const server = express();

const TWO_HOURS = 1000 * 60 * 60 * 60 * 2

const {
  SESS_LIFETIME = TWO_HOURS,
  NODE_ENV = 'development',
  SESS_NAME = 'sid',
  SESS_SECRETE = 'shubbhang.it\asecrete'
} = process.env

const IN_PROD =  NODE_ENV === 'production';

server.use(bodyParser.urlencoded({
    extended: true
  }));
  server.use(bodyParser.json());

// EXPRESS SPECIFIC STUFF
server.use('/static',express.static('static')); // serving static files
server.use(express.urlencoded());

//set the templates directory
server.set('views', path.join(__dirname, '../templates')); 

// settings to render html templates
nunjucks.configure('templates', {
  express: server,
  autoescape: true
});
server.set('view engine', 'html');

// only to check server is working or not
server.get('/trifle', (req, res) => { 
    res.status(200).json({message:"its working"})
});


server.use(session({
  name : SESS_NAME,
  resave : false,
  saveUninitialized : false,
  secret : SESS_SECRETE,
  cookie : {
      maxAge : SESS_LIFETIME,
      sameSite : true,
      secure : IN_PROD
  }
}))

//remove cache of browser
server.use(function(req, res, next) {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});



// flash messages
server.use(flash({ locals: 'flash' }));




const redirectlogin = (req,res,next) => {
  if (!req.session.userId) {
      res.redirect('/signin');
  }
  else{
      next();
  }
}


//routes for pages
server.use('/',require('./home')); // ./home ==> home.js
server.use('/about',require('./about'));
server.use('/contact',require('./contact'));
server.use('/shop',require('./shop'));
server.use('/cart',require('./cart'));
server.use('/signin',require('./sign_in'));
server.use('/signup',require('./sign_up'));

server.get('/oops',(req,res) => {
  req.flash('successMessage', 'You are successfully using req-flash');
  console.log(res.locals['flash']);
  res.render('OOPs.html');
})

server.get('/additems',(req,res) => {
  return res.render('index2.html');
})

server.post('/additems',(req,res) => {
  const data = req.body;
  User.additems(data).then(item => {
    console.log(item);
  })
  .catch(err => {
    console.log('error in server route main');
    res.redirect('/oops')
  })
  res.redirect('/additems');
})

server.get('/desc/:id',(req,res) => {
  const {id} = req.params;

  User.finditemByid(id).then(item => {
    console.log(item);
    res.status(200).render('item_desc.html',{item : item});
  })
  .catch(err => {
    console.log('error in server route main');
    res.redirect('/oops')
  })
})


server.get('/logout',redirectlogin, (req,res) => {
  req.session.destroy(err => {
      if(err) {
          return res.redirect('/shop');
      }
      
      res.clearCookie(SESS_NAME);
      return res.redirect('/');
  });
})

module.exports = server;