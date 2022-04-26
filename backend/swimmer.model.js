const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Swimmer = new Schema({
    name: {
        type: String
    },
    gender: {
        type: String
    },
    grade: {
        type: String
    },
    points: {
        type: Number
    },
    eventTypeIds: {
        type: [String]
    },
    bestTimes: {
        type: [[Number]]
    },
    hCapTimes: {
        type: [Number]
    }
});

module.exports = mongoose.model('Swimmer', Swimmer);