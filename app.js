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
var cors = require('cors');

var app = express();

//////////////////////////////
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};
///////////////////////////////

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI)
  .then(() =>  console.log('connection successful'))
  .catch((err) => console.error(err));

/////////////////////////////////

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(allowCrossDomain);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'true'}));


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

passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());

app.use(cookieParser()); // read cookies (needed for auth)
app.use(session({ secret: 'codecliquesoftwarellc',
    saveUninitialized: true,
    resave: true })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash());
app.use(cors());

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



router.post('/login', function(req, res) {
     passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) { return res.json({message: "User does not exist"}); }
        req.logIn(user, function(err) {
        if (err) { return next(err); }
        return res.json({message: "Logged In"});
        });
    })(req, res, next);
});

router.route('/logout')

    .get(function(req, res) {

        req.logout();
        req.session.destroy(function (err) {
        if (!err) {
            res.status(200).clearCookie('connect.sid', {path: '/'}).json({status: "Success"});
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
      res.status(401).end();
    }
}

module.exports = app;