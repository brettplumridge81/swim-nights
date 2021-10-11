const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Swimmer = new Schema({
    name: {
        type: String
    },
    dob: {
        type: String
    }/*,
    points: {
        type: int
    }*/
});

module.exports = mongoose.model('Swimmer', Swimmer);