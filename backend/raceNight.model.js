const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let RaceNight = new Schema({
    raceNightDate: {
        type: String
    },
    raceEvents: [{
        type: String
    }]
});

module.exports = mongoose.model('RaceNight', RaceNight);