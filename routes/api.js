const express = require('express');
const router = express.Router();
const  Trip =  require('../models/Trip');


// create a new trip 
router.post('/', (req, res, next) => {
    let park = req.park
    Trip.create({
        name: park.name,

    })

})
// add to a trip
router.put('/:id', )

//get all trips
router.get('/', (req, res, next) => {

})

// Queen.create({
//     name: data.name,
//     age: data.age,
//     royalJellyFlavor: data.flavor
// }, function(err) {
//     if (err) return next(err);
//     res.redirect('/queens');
// });


// router.get('/:id', (req, res, next) => {
//     Park.findById(req.params.id)
//         .then(park => {res.json(park)});
// });

// router.get('/', (req, res, next) => {

// });


module.exports = router;