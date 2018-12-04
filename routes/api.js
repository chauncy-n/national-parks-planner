const express = require('express');
const router = express.Router();
const  Trip =  require('../models/Trip');


// create a new trip 
router.post('/', (req, res, next) => {
    let park = req.park
    Trip.create({
        name: park.name,
        startDate: 
        endDate:
        parks:
    })

})
// add to a trip
router.put('/:id', )

//get all trips
router.get('/', (req, res, next) => {

})



// router.get('/:id', (req, res, next) => {
//     Park.findById(req.params.id)
//         .then(park => {res.json(park)});
// });

// router.get('/', (req, res, next) => {

// });


module.exports = router;