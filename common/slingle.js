
var jade = require('jade');
var extend = require('util')._extend;
var path = require('path');

exports.view = function(res, view, model, params) {
    // some modules may use "cd" so better use the complete path!
    var appDir = path.dirname(require.main.filename);
    view = path.join(appDir, 'views/' + view + ".jade");
    console.log(view);
    jade.renderFile(view, model, function(err, html){
        res.json(extend({
            type: "view",
            content: html
        }, params));
    });
}

exports.error = function(res, params) {
    res.json(extend({
        type: "error"
    }, params));
}

exports.location = function(res, url, params) {
    res.json(extend({
        type: "location",
        url: url
    }, params));
}
var jade = require('jade');
var extend = require('util')._extend;
var path = require('path');

exports.view = function(res, view, model, params) {
    // some modules may use "cd" so better use the complete path!
    var appDir = path.dirname(require.main.filename);
    view = path.join(appDir, 'views/' + view + ".jade");
    console.log(view);
    jade.renderFile(view, model, function(err, html){
        res.json(extend({
            type: "view",
            content: html
        }, params));
    });
}

exports.error = function(res, params) {
    res.json(extend({
        type: "error"
    }, params));
}

exports.location = function(res, url, params) {
    res.json(extend({
        type: "location",
        url: url
    }, params));
}