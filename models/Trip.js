const mongoose = require('mongoose');


const parkSchema = new mongoose.Schema ({
    parkName: String
})

const tripSchema = new mongoose.Schema({
    name: String,
    parks:[parkSchema]
})

const Trip = mongoose.model('Trip', tripSchema)


module.exports = Trip;