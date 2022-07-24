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
    raceNightType: {
        type: String
    },
    recordSwimmerName: {
        type: String
    },
    recordTime: {
        type: [Number]
    }
});

module.exports = mongoose.model('EventType', EventType);