var slingle = require("../common/slingle");
var Movie = require('../models/movie');
var request = require("request");
var url = require("url");
var aws = require("aws-lib");
var async = require('async');
var config = require('konphyg')("./config");


//var prodAdv = aws.createProdAdvClient(config("amazonAWS").accessKeyId, config("amazonAWS").secretAccessKey, config("amazonAWS").associateTag);


var groupAttributes = [ 'Genre' , 'User Id', 'Title'];
var searchAttributes = [ 'title', 'actor', 'director', 'asin', 'ean' ];
var internalGroupAttr;


function index(req, res) {
    slingle.view(res, 'movies/index', { }, { });
}

function getAllDistinctAttributes(req, res) {

    async.series([
        function (callback){
            getInternalGroupName(req, function() {
                callback();
            })
        },
        function(callback) {
            Movie.find().find({'userId': req.session.passport.user}).distinct(internalGroupAttr, function (err, distinctGroups) {
                slingle.view(res, 'movies/movies', { gAttr: req.query.gAttr, distinctGroups: distinctGroups
                        , allGAttr: groupAttributes, allSAttr: searchAttributes }
                    , { messages: [{ type: "success", text: "Hey bro " + distinctGroups.length + " Groups found" }]
                });
                callback();
            });
        }

    ], function(err) {
        if (err) return next(err);
    });
}

function getAllMoviesPerGroupAttribute(req, res) {
    async.series([
        function (callback){
            getInternalGroupName(req, function() {
                callback();
            })
        },

        function(callback) {
            Movie.where(internalGroupAttr, req.query.gName).find({'userId': req.session.passport.user}, function (err, videos) {
                slingle.view(res, 'movies/movieDetails', { videos: videos }
                    , { messages: [{ type: "success", text: "Hey bro " + videos.length + " Movies found"}]
                });
                callback();
            });
        }

    ], function(err) {
        if (err) return next(err);
    });
}

function addMovie(req, res) {

    Movie.count({ asin: req.body.asin }, function(err, count){
        Movie.count({ userid: req.session.passport.user }, function(err, count) {

            if (count > 0) {
                Movie.findOneAndUpdate(
                    { asin: req.body.asin },
                    { $push: { userId: req.session.passport.user } },
                    function (err, org) {
                        if (err) {
                            console.log(err);
                            res.send(null, 500);
                        } else {
                            res.send(null, 200);
                        }
                    });
            }
        });
    });
}





function searchMovie(req, res) {

    Movie.find({ }, function (err, videos) {
        slingle.view(res, 'movies/searchResult', { videos: videos }
            , { messages: [{ type: "success", text: "Hey bro " + videos.length + " Movies found"}]
            });
    });




    //var options = {SearchIndex: "books", Keywords: "Javascript"}

/*    prodAdv.call("ItemSearch", options, function(err, result) {
        if (err) {
            slingle.error(res, { messages: [ err ]});
        } else {
            slingle.view(res, 'videos/videos', { resultData: result }, { });
        }
    })*/



}

function deleteMovie(req, res) {

    Movie.findOneAndUpdate(
        { _id: req.body.id },
        { $pull: { userId:  req.session.passport.user } },
        function(err, org) {
            if (err) {
                console.log(err);
                res.send(null, 500);
            }else {
                res.send(null, 200);
            }
    });
}


function getInternalGroupName(req, callback){
    switch (req.query.gAttr)
    {
        case 'Published Year':
            internalGroupAttr = 'itemAttributes.PublicationDate';
            callback();
            break;
        case 'User Id':
            internalGroupAttr = 'userId';
            callback();
            break;
        case 'Title':
            internalGroupAttr = 'itemAttributes.title';
            callback();
            break;
        default :
            internalGroupAttr = 'itemAttributes.genre';
            callback();
            break;
    }
}

module.exports = function (app) {
    app.get('/movies', isLoggedIn, index);
    app.get('/movies/gGAttr',  isLoggedIn, getAllDistinctAttributes);
    app.get('/movies/gVGAttr', isLoggedIn, getAllMoviesPerGroupAttribute);

    app.post('/movies/addVideo', isLoggedIn, addMovie);
    app.get('/movies/searchVideo', isLoggedIn, searchMovie);

    app.post('/movies/deleteVideo', isLoggedIn, deleteMovie);

};


// route middleware to make sure a user is logged in

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
