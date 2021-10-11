const mongoose = require('mongoose');
const resultModel = require('./result.model');
const swimmerModel = require('./swimmer.model');
const Schema = mongoose.Schema;

let RaceEvent = new Schema({
    eventId: {
        type: String
    },
    name: {
        type: String
    },
    Swimmers: {
        type: swimmerModel
    },
    Results: {
        type: resultModel
    }
});

module.exports = mongoose.model('RaceEvent', RaceEvent);