// Load the bcrypt module to match passwords
var bcrypt = require('bcrypt-nodejs');
// Load passport module, an authentication middleware for Node.js
// Strategy to authenticate user: LocalStrategy
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

var User = require('../models').user;

// verifying incoming password against the hashed password
function passwordsMatch(passwordSubmitted, passwordStored) {
  return bcrypt.compare(passwordSubmitted, passwordStored, function(err, res) {
    if (err) {
      return console.error(err)
    }
  });
}

/*
function passwordsMatch(passwordSubmitted, storedPassword) {
  return bcrypt.compareSync(passwordSubmitted, storedPassword);
}
*/

/*
// configuring LocalStrategy
passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({username: username}, function(user) {
      if (user) {
        if (passwordsMatch(password, user.password) === false) {
          return done(null, false, { message: 'Incorrect password.'});
        }
      }
      else if (user == null) {
        return done(null, false, { message: 'Incorrect username.'});
      }
      return done(null, user, { message: 'Successfully logged In.'});
    });
  }
));
*/

passport.use(new LocalStrategy({
  usernameField: 'username',
},
  (username, password, done) => {
    User.findOne({
      where: { username },
    }).then((user) => {
      if (user) {
        if (passwordsMatch(password, user.password) === false) {
          return done(null, false, { message: 'Incorrect password.' });
        }
      } else if (user == null) {
        return done(null, false, { message: 'Incorrect email.' });
      }

      return done(null, user, { message: 'Successfully Logged In!' });
    });
  })
);


passport.use('login', new LocalStrategy({
    passReqToCallback : true
  },  {
  usernameField: 'username',
},
  (username, password, done) => {
    User.findOne({
      where: { username },
    }).then((user) => {
      if (user) {
        if (passwordsMatch(password, user.password) === false) {
          return done(null, false, { message: 'Incorrect password.' });
        }
      } else if (user == null) {
        return done(null, false, { message: 'Incorrect email.' });
      }

      return done(null, user, { message: 'Successfully Logged In!' });
    });
  })
);


// serialize user instance to session with only the username
passport.serializeUser(function(user, done) {
  done(null, user.username);
})

// deserialize user instance from session
passport.deserializeUser(function(username, done) {
  User.findById(username, function(user) {
    if (user == null) {
      return done(null, false);
    }

    return done(null, user);
  });
});

passport.redirectIfLoggedIn = (route) =>
  (req, res, next) => (req.user ? res.redirect(route) : next());

passport.redirectIfNotLoggedIn = (route) =>
  (req, res, next) => (req.user ? next() : res.redirect(route));

module.exports = passport;
