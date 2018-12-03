const mongoose = require('mongoose');


const parkSchema = new mongoose.Schema ({
    parkName: String
})

const tripSchema = new mongoose.Schema({
    name: String,
    startDate: Date,
    endDate: Date,
    parks:[parkSchema]
})

const Trip = mongoose.model('Trip', tripSchema)


module.exports = Trip;