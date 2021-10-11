const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Result = new Schema({
    resultId: {
        type: String
    },
    time: {
        type: double
    },
    place: {
        type: int
    }
});

module.exports = mongoose.model('Result', Result);