/**
 * Created by dennis on 4/1/14.
 */

var account = require("./account.js");

module.exports = function(app, passport)
{
    app.get('/', isLoggedIn , function (req, res) {
        res.render('home/index', {
            user: req.user
        });
    });
}


// route middleware to make sure a user is logged in

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/login');
}
