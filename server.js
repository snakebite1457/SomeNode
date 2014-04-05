// server.js

// set up ======================================================================
// get all the tools we need
var express        = require('express');
var mongoose       = require('mongoose');
var passport       = require('passport');
var flash          = require('connect-flash');
var path           = require('path');
var lessMiddleware = require('less-middleware');
var config         = require('konphyg')(__dirname + "/config");
var app            = express();

// test db acces ===============================================================
mongoose.connect(config("database").subprint);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongodb connection error: '));
db.once('open', function callback() {
    console.log("mongodb connection established to " + config("database").subprint);
});

require('./api/passport')(passport); // pass passport for configuration

app.set('port', config("server").port);
app.set('views', path.join(__dirname, "views"));
app.set('view engine', 'jade');

app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('keyboard cat'));
app.use(express.session({ cookie: { maxAge: 60000 }}));
app.use(lessMiddleware(__dirname + '/client'));
app.use(express.static(__dirname + '/client'));
app.set("jsonp callback", true);
app.use(flash());

// required for passport
app.use(express.session({ secret: 'secretkey' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(app.router);


app.configure('development', function () {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function () {
    app.use(express.errorHandler());
});

app.listen(config("server").port, function () {
    console.log("express server listening on port %d ", config("server").port);
});

// routes ======================================================================
require('./controllers')(app, passport); // load our routes and pass in our app and fully configured passport