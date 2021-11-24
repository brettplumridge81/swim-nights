const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Result = new Schema({
    resultId: {
        type: String
    },
    time: {
        type: Number
    },
    place: {
        type: Number
    }
});

module.exports = mongoose.model('Result', Result);