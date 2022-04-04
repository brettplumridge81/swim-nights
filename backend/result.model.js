const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Result = new Schema({
    resultId: {
        type: String
    },
    raceEventId: {
        type: String
    },
    swimmerName: {
        type: String
    },
    goAt: {
        type: Number
    },
    grossTime: {
        type: [Number]
    },
    netTime: {
        type: [Number]
    },
    place: {
        type: Number
    },
    points: {
        type: Number
    }
});

module.exports = mongoose.model('Result', Result);