const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let RaceNight = new Schema({
    date: {
        type: [Number]
    },
    raceEventIds: {
        type: [String]
    }
});

module.exports = mongoose.model('RaceNight', RaceNight);