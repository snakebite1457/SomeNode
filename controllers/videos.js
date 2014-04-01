var slingle = require("../common/slingle.js");
var Video = require('../models/video.js');
var request = require("request");
var url = require("url");

function index(req, res) {
    slingle.view(res, 'videos/index', { }, { });
}

function videos(req, res) {
    Video.find({}, function(err, data) {
        slingle.view(res, 'videos/videos', { videos: data }, { });
    })
}

module.exports = function (app) {
    app.get('/videos', index);
    app.get('/videos/videos', videos);

};
