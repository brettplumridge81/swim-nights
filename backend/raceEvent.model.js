const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let RaceEvent = new Schema({
    raceEventId: {
        type: String
    },
    eventTypeId: {
        type: String
    },
    swimmerIds: {
        type: [String]
    },
    resultIds: {
        type: [String]
    },
    date: {
        type: [Number]
    }
});

module.exports = mongoose.model('RaceEvent', RaceEvent);