const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let RaceEvent = new Schema({
    raceEventId: {
        type: String
    },
    eventTypeId: {
        type: String
    },
    swimmerNames: {
        type: [String]
    },
    grades: {
        type: [String]
    },
    isRelay: {
        type: Boolean
    },
    swimmersPerTeam: {
        type: Number
    },
    isEnterOwnHcapTime: {
        type: Boolean
    },
    resultIds: {
        type: [String]
    },
    date: {
        type: [Number]
    },
    eventNumber: {
        type: Number
    }
});

module.exports = mongoose.model('RaceEvent', RaceEvent);