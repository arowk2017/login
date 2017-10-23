var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var Users = require('./models/users');
var cors = require('cors');
var passport = require('passport'),
LocalStrategy = require('passport-local').Strategy;
var app = express();

var jwt = require('express-jwt');
var auth = jwt({
  secret: process.env.LOGIN_SECRET,
  userProperty: 'payload'
});

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI)
  .then(() =>  console.log('connection successful'))
  .catch((err) => console.error(err));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'true'}));

var redis = require("redis").createClient(process.env.REDISTOGO_URL);

passport.use(new LocalStrategy(
  function(username, password, done) {
    
    Users.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
    console.log(user);
    done(null, user.id);
});
passport.deserializeUser(function(id, done) {
    console.log("user id: " + id);
    User.findById(id, function(err, user) {
        done(err, user);
 });
  });


app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions


app.get('/', function(request, response) {
 response.send('Demo-login');
});

app.get('/login_fail', function(request, response) {
 response.status(401).json({ message: 'Login Failed!' });
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
                var token;
                token = user.generateJwt();
                res.status(200);
                res.json({ message: 'User created!', "token" : token });
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

router.route('/current_user')

    .post(function(req, res) {

    })
      
    .get(auth, function(req, res) {

      // If no user ID exists in the JWT return a 401
      if (!req.payload._id) {
        res.status(401).json({
          "message" : "UnauthorizedError"
        });
      } else {
        Users.findById(req.payload._id).exec(function(err, user) {
            res.status(200).json(user);
          });
      }
      
    });

//LOGIN

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    var token;

    if (err) {
      console.log("Error: " + err); 
      return next(err); 
    }
    if (!user) {
      console.log("Error: User does not exist"); 
      return res.redirect('/login_fail'); 
    }
    req.logIn(user, function(err_login) {
      if (err_login) {
        console.log("Error while login: " + err_login); 
        return next(err_login); 
      }

      token = user.generateJwt();
      return res.status(200).json({status: "Success", "token" : token});
    
      
    });
  })(req, res, next);
});

router.route('/logout')

    .get(function(req, res) {

        req.logout();
        req.session.destroy(function (err) {
        if (!err) {
            res.status(200).json({status: "Success"});
        } else {
            // handle error case...
        }
          });
        
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

function checkAuthentication(req,res,next){
    if(req.isAuthenticated()){
        next();
    } else{
        console.log("here1");
      res.status(401).end();
    }
}

module.exports = app;