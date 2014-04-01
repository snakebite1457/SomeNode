
'use strict';
var fs = require('fs');
var path = require('path');

module.exports = function (app, passport) {
    fs.readdirSync('./controllers').forEach(function (file) {
        if (file === path.basename(__filename)) { return; }
        require('./' + file)(app, passport);
    });
};