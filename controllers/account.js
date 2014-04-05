
var slingle = require("../common/slingle.js");

module.exports = function(app, passport) {

	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/login', function(req, res) {
		res.render('home/login.jade', {
            messages: req.flash('message')
        });
    });

	// process the signup form
	// app.post('/signup', do all our passport stuff here);

	// =====================================
	// PROFILE SECTION =====================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});



	// process the signup form
	app.post('/signup', function(req, res, next) {
        passport.authenticate('local-signup', function (err, user, info) {
            if (err) {
                return next(err);
            }

            //TODO: Let Dennis show this freaking shit

            if (!user) {
                req.flash('message','{text: ' + info.message + ', type: "danger"}' );
                return slingle.location(res, "/");
            }

            req.flash('message','{text: "Yes bro you are now registered!", type: "danger"}');
            return slingle.location(res, "/");

        })(req, res, next);
	});
	
	// process the login form
	app.post('/login',   function(req, res, next) {
        passport.authenticate('local-login', function (err, user, info) {
            if (err) {
                return next(err);
            }

            if (!user) {
                req.flash('message','{text: ' + info.message + ', type: "danger"}' );
                return slingle.location(res, "/");
            }

            req.logIn(user, function (err) {
                if (err) {
                    next(err);
                }

                req.flash('message', '{text: "Yes bro you are now logged in!", type: "danger"}');
                return slingle.location(res, "/");

            });
        })(req, res, next);
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}


