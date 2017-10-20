var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport'),
LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var Users = require('./models/users');

var app = express();

///////////////////////////////

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI)
  .then(() =>  console.log('connection successful'))
  .catch((err) => console.error(err));

/////////////////////////////////

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'true'}));

app.get('/', function(request, response) {
 response.send('Demo-login');
});


var router = express.Router();             

router.route('/')

    .post(function(req, res) {

    })
      
    .get(function(req, res) {
       
    });

router.route('/users')

    .post(function(req, res) {

        var users = new Users();      
        users.username = req.body.username;  
        users.password = users.generateHash(req.body.password);
        
        users.save(function(err) {
            if (err)
              {
               res.send(err);
              }
            else
              {
                res.json({ message: 'User created!' });
              }  

        });
    })
      
    .get(function(req, res) {

            Users.find(function(err, users) {
                    if (err)
                    {
                    res.send(err);
                    }
                    else
                    {
                        res.json(users);
                    }
                                
                });
    });

router.route('/contact')

    .post(function(req, res) {

    })
      
    .get(function(req, res) {

    });



// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


function handleError(res) {
    return function(error) {
        return res.status(500).send({error: error.message});
    }
}

module.exports = app;