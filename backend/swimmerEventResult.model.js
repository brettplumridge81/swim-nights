const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let SwimmerEventResult = new Schema({
    swimmerEventResultId: {
        type: String
    },
    swimmerId: {
        type: String
    },
    eventTypeId: {
        type: String
    },
    raceEventId: {
        type: [String]
    },
    recordedTime: {
        type: [[Number]]
    },
    recordedPlace: {
        type: Number
    },
    points: {
        type: Number
    }
});

module.exports = mongoose.model('SwimmerEventResult', SwimmerEventResult);