const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let EventType = new Schema({
    eventTypeId: {
        type: String
    },
    stroke: {
        type: String
    },
    distance: {
        type: Number
    },
    grades: {
        type: [String]
    },
    gender: {
        type: String
    },
    isRelay: {
        type: Boolean
    },
    swimmersPerTeam: {
        type: Number
    },
    isScratch: {
        type: Boolean
    },
    isEnterOwnHcapTime: {
        type: Boolean
    },
    isNovalty: {
        type: Boolean
    }
});

module.exports = mongoose.model('EventType', EventType);