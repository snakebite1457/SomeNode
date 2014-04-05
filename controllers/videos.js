var slingle = require("../common/slingle.js");
var Video = require('../models/video.js');
var request = require("request");
var url = require("url");
var aws = require("aws-lib");
var config = require('konphyg')("./config");

//var prodAdv = aws.createProdAdvClient(config("amazonAWS").accessKeyId, config("amazonAWS").secretAccessKey, config("amazonAWS").associateTag);

function index(req, res) {
    slingle.view(res, 'videos/index', { videoSearchAttr: req.query.videoSearchAttr }, { });
}

function videos(req, res) {
    Video.find({}, function(err, data) {
        slingle.view(res, 'videos/videos', { videos: data }, { });
    })
}

function addVideo(req, res) {

}

function getAllDistinctAttr(req, res) {
    Video.find().distinct(req.query.videoSearchAttr, function (err, data) {
        slingle.view(res, 'videos/videos', { videoSearchAttr: req.query.videoSearchAttr, data: data }, { });
    });
}

function getAllVideosPerGenre(req, res) {
    Video.where(req.query.videoSearchAttr, req.query.value).find(function (err, data) {
        slingle.view(res, 'videos/videoDetails', { videos: data }, { });
    });
}

function searchVideo(req, res) {






    //var options = {SearchIndex: "Books", Keywords: "Javascript"}

/*    prodAdv.call("ItemSearch", options, function(err, result) {
        if (err) {
            slingle.error(res, { messages: [ err ]});
        } else {
            slingle.view(res, 'videos/videos', { resultData: result }, { });
        }
    })*/



}

module.exports = function (app) {
    app.get('/videos', isLoggedIn, index);
    app.get('/videos/getAllDistinctAttr',  isLoggedIn, getAllDistinctAttr);
    app.post('/videos/addVideo', isLoggedIn,  addVideo);
    app.get('/videos/searchVideo', isLoggedIn, searchVideo);
    app.get('/videos/getAllVideosPerGenre', isLoggedIn, getAllVideosPerGenre);
};


// route middleware to make sure a user is logged in

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
