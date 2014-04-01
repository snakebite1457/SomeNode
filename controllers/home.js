/**
 * Created by dennis on 4/1/14.
 */


var slingle = require("../common/slingle.js");

// =====================================
// HOME PAGE (with login links) ========
// =====================================
function index(req, res) {
    res.render('home/index');
}

module.exports = function(app, passport)
{
    app.get('/', index);
}