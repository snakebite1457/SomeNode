var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = mongoose.Schema.ObjectId;

// define the schema for our user model
var videoSchema = mongoose.Schema({

    asin            : String,
    detailsPageUrl  : String,

    userId: [Schema.Types.ObjectId],
    itemAttributes: {
        ean: { type: String, lowercase: true, trim: true },
        title: { type: String, lowercase: true, trim: true },
        genre: { type: String, trim: true}
    }
});

module.exports = mongoose.model('Video', videoSchema);