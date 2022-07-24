const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let RaceEvent = new Schema({
    raceEventId: {
        type: String
    },
    eventTypeId: {
        type: String
    },
    stroke: {
        type: String
    },
    distance: {
        type: Number
    },
    swimmerNames: {
        type: [String]
    },
    grades: {
        type: [String]
    },
    resultIds: {
        type: [String]
    },
    date: {
        type: [Number]
    },
    eventNumber: {
        type: Number
    },
    raceNightType: {
        type: String
    }
});

module.exports = mongoose.model('RaceEvent', RaceEvent);