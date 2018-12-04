const express = require('express');
const router = express.Router();
const  Trip =  require('../models/Trip');


//get all trips
router.get('/trips/:userId', (req, res, next) => {
    console.log("OMG")
    User.findById(req.params.userId)
        .then(user => {res.json(user.trips)})
})

//get a specific trip
router.get('/trips/:userId/:id', (req, res, next) => {

})

// create a new trip 
router.post('/trips/:userId', (req, res, next) => {
    let park = req.park
    Trip.create({
        name: park.name,
        parks: []
    })
})
// add to a trip
router.put('/trips/:userId/:id', )





// router.get('/:id', (req, res, next) => {
//     Park.findById(req.params.id)
//         .then(park => {res.json(park)});
// });

// router.get('/', (req, res, next) => {

// });


module.exports = router;