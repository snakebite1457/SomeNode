var mongoose = require('mongoose');

// define the schema for our user model
var videoSchema = mongoose.Schema({

    videoId     : String,
    name        : String
});

module.exports = mongoose.model('Video', videoSchema);