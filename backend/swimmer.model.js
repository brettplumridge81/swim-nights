const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Swimmer = new Schema({
    swimmerId: {
        type: String
    },
    name: {
        type: String
    },
    dob: {
        type: [Number]
    },
    ageAtSeasonStart: {
        type: Number
    },
    points: {
        type: Number
    }
});

module.exports = mongoose.model('Swimmer', Swimmer);