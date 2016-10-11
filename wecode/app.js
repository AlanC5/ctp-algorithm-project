var express = require('express');
var exphbs = require('express-handlebars');
var app = express();

//initialize engine for handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


// loading and mounting controllers
//app.use(require('./controllers/'));

// only requests to /* will be sent to our "problem" router
const problem = require('./controllers/problem');
app.use('/', problem);

// only requests to /user/* will be sent to our "profile" router
const profile = require('./controllers/profile');
app.use('/username', profile);

// only requests to /login/* will be sent to our "login" router
const login = require('./controllers/login');
app.use('/login', login);

// only requests to /register/* will be sent to our "register" router
const register = require('./controllers/register');
app.use('/register', register);

// only requests to /results/* will be sent to our "results" router
const results = require('./controllers/results');
app.use('/results', results);

app.listen(8000);
