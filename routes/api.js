const express = require('express');
const router = express.Router();
const  Trip =  require('../models/Trip');
const  User =  require('../models/User');


//get all trips
router.get('/trips/:userId', (req, res) => {
    User.findById(req.params.userId).populate('trips').exec((err, user) => {
        res.json(user.trips)
    })
})
//add a new park 
router.post('/trips/:tripId', (req, res) => {
    Trip.findById(req.body.id, (err, trip) => {
        trip.parks.push({parkName: req.body.park})
        console.log(trip)
        trip.save()
    })
})


//get a specific trip
router.get('/trips/:userId/:id', (req, res) => {

})
// trip.save(() => {
//     res.json(user.trips)
// })

module.exports = router;