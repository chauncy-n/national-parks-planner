const mongoose = require('mongoose');


const ParkSchema = new mongoose.Schema ({
    parkCode: String
})

const tripSchema = new mongoose.Schema({
    name: String,
    startDate: Date,
    endDate: Date,
    parks:[ParkSchema]
})

module.exports = mongoose.model('Trip', tripSchema);