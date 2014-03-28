// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var mongoose = require('mongoose');
var passport = require('passport');
var port     = process.env.PORT || 3000;
var ip       = process.env.IP || "0.0.0.0";

// configuration ===============================================================
mongoose.connect(ip); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

app.configure(function() {

	// set up our express application
	app.use(express.logger('dev')); // log every request to the console
	app.use(express.cookieParser()); // read cookies (needed for auth)
	app.use(express.bodyParser()); // get information from html forms
    app.use(express.static(__dirname + '/client'));
    
    app.set('view engine', 'ejs'); // set up ejs for templating

	// required for passport
	app.use(express.session({ secret: 'secretkey' })); // session secret
	app.use(passport.initialize());
	app.use(passport.session()); // persistent login sessions

});

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport


app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0",  function() {
  console.log("Server listening at", ip + ":" + port);
});
