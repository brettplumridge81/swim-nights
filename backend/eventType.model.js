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
    minAge: {
        type: Number
    },
    maxAge: {
        type: Number
    }
});

module.exports = mongoose.model('EventType', EventType);