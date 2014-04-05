/**
 * Created by dennis on 4/3/14.
 */


var config          = require('konphyg')(__dirname + "./../config");
var mongoose        = require('mongoose');
var Video           = require('../models/video.js');
var User            = require('../models/user');

var sampleGenre = [ "Action", "Drama", "Horror", "Comedy" ];

mongoose.connect(config("database").subprint);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongodb connection error: '));
db.once('open', function callback() {
    console.log("mongodb connection established to " + config("database").videoUrl);



/*    Video.find({}, function(err, data) {
        data.forEach(function(item) {
            Video.remove(item);
            console.log("video deleted");
        });

    });*/

   /* User.findOne({ 'local.email': "admin" }, function (err, user) {
        if (err) {
            createVideos();
        } else {
            User.remove(user, function () {

                var newUser            = new User();

                // set the user'controllers local credentials
                newUser.local.email    = "admin";
                newUser.local.password = newUser.generateHash("admin");

                // save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    createVideos();
                });


            });
        }
    });*/

    createVideos();
});


function createVideos () {
    User.findOne({ 'local.email': "admin" }, function (err, user) {
        // if there are any errors, return the error
        if (err)
            return done(err);

        for (var i = 0; i < 10; i++) {
            var video = new Video();
            console.log(user);
            video.userId = user._id;
            video.asin = "B00CPG7S8E";
            video.detailsPageUrl = "http://www.amazon.de/Fast-Furious-6-Paul-Walker/dp/B00CPG7S8E/ref=sr_1_1?ie=UTF8&qid=1396531186&sr=8-1&keywords=fast+and+furious+6";
            video.itemAttributes.ean = "asdasdasd";
            video.itemAttributes.title = "Fast & Furious 6";
            video.itemAttributes.genre = sampleGenre[randomIntInc(0, 3)];

            video.save(function (err) {
                if (err)
                    throw err;

                console.log("video added");
            });
        }
    });
}

function randomIntInc (low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}