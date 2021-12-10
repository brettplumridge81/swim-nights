const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let RaceSheet = new Schema({
    raceSheetId: {
        type: String
    },
    raceEventId: {
        type: String
    },
    eventTypeId: {
        type: String
    },
    eventNumber: {
        type: Number
    },
    heatNumber: {
        type: Number
    },
    swimmerIds: {
        type: [String]
    },
    hcapTimes: {
        type: [Number]
    },
    goAts: {
        type: [Number]
    }
});

module.exports = mongoose.model('RaceSheet', RaceSheet);