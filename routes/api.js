const express = require('express');
const router = express.Router();
const  Trip =  require('../models/Trip');
const  User =  require('../models/User');


function reportError(err, res) {
    if (err) {
        res.json({
            type: 'db_error',
            status: 500,
            message: "Database error occurred when creating a trip",
            error: err
        });
        return true
    } else {
        return false
    }
}
//get all trips
router.get('/trips/:userId', (req, res) => {
    User.findById(req.params.userId).populate('trips').exec((err, user) => {
        if (reportError(err, res)) { return }

        res.json(user.trips)
    })
})
//add a new park 

router.post('/trips/:tripId', (req, res) => {
    Trip.findById(req.params.tripId, (err, trip) => {
        if (reportError(err, res)) { return }
        trip.parks.push({parkName: req.body.park})
        console.log(trip)
        trip.save(() => {
            res.json(trip)
        })
    })
})
// delete a park from trip
// /trips/1/parks/Alagnak
router.delete('/trips/:tripId/parks/:parkName', (req, res) =>{

    Trip.findById(req.params.tripId, (err, trip) => {
        if (reportError(err, res)) { return }
        trip.parks = trip.parks.filter(park => req.params.parkName != park.parkName);
        trip.save(() => res.json(trip))
    })
})
//get a specific trip
router.get('/trips/:userId/:id', (req, res) => {

})

router.post('/trips/new', (req, res)=> {
    Trip.create({
        name: "another trip",

    })
})


module.exports = router;