var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = mongoose.Schema.ObjectId;
    User = require('./user');

// define the schema for our user model
var movieSchema = mongoose.Schema({

    asin            : String,
    detailsPageUrl  : String,

    userId: [{ type: ObjectId, ref: 'User' }],
    itemAttributes: {
        ean: { type: String, lowercase: true, trim: true },
        title: { type: String, lowercase: true, trim: true },
        genre: { type: String, trim: true}
    }
});

module.exports = mongoose.model('Movie', movieSchema);


