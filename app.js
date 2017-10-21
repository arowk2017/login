var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport'),
LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
//var cookieParser = require('cookie-parser');
var Users = require('./models/users');
var cors = require('cors');
 
var RedisStore = require('connect-redis')(session);
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


app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(allowCrossDomain);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'true'}));

/////////////////////////////////


    //var rtg   = require("url").parse(process.env.REDISTOGO_URL);
    //var redis = require("redis").createClient(rtg.port, rtg.hostname);
var redis = require("redis").createClient(process.env.REDISTOGO_URL);
//var redisUrl = url.parse(process.env.REDISTOGO_URL);
        //var redisAuth = redisUrl.auth.split(':'); 

var redisOptions = {
   //host: redisUrl.hostname,
            //port: redisUrl.port,
            //db: redisAuth[0],
           //pass: redisAuth[1],
     client: redis,
     //url: process.env.REDISTOGO_URL,
     logErrors: true
     //ttl: SESSION_TTL
 };

var redisStore = new RedisStore(redisOptions);
//app.use(cookieParser()); 
app.set('trust proxy', 1);
app.use(session({
    store: redisStore,
     secret: 'codecliquesoftwarellc',
     resave: false,
  saveUninitialized: false,
  cookie: { secure: true }
}));


// and use it in application
//app.use(session);

/////////////////////////////////////

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

//passport.serializeUser(Users.serializeUser());
//passport.deserializeUser(Users.deserializeUser());

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


// read cookies (needed for auth)

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash());
app.use(cors());

app.get('/', function(request, response) {
 response.send('Demo-login');
});

app.get('/login_fail', function(request, response) {
 response.status(401).json({ message: 'Login Failed!' });
});

/*
app.get('/login_success', checkAuthentication, function(request, response) {
 response.status(200).json({status: "Success"});
});
*/


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

router.route('/current_user')

    .post(function(req, res) {

    })
      
    .get(checkAuthentication, function(req, res) {

        res.json({username: req.username});
    });

//LOGIN
/*
router.post('/login', passport.authenticate('local',
  function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    // Then you can send your json as response.
    console.log(req.user);
    res.json({message:"Login Success", username: req.user,
  userid: req.user._id});
  }));

  */

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
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

      req.session.messages = "Login successfull";
      req.session.authenticated = true;
      req.authenticated = true;

      if (req.session.returnTo){
        return res.redirect(req.session.returnTo);
      }


      return res.status(200).json({status: "Success"});
    
      
    });
  })(req, res, next);
});


/*
  router.post('/login',  passport.authenticate('local', { successRedirect: '/login_success',
                                   failureRedirect: '/login_fail',
                                   failureFlash: 'Invalid username or password.' }));
*/

/*
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
*/
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