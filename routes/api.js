const express = require('express');
const router = express.Router();
const  Trip =  require('../models/Trip');
const  User =  require('../models/User');


//get all trips
router.get('/trips/:userId', (req, res, next) => {
    User.findById(req.params.userId).populate('trips').exec((err, user) => {
        res.json(user.trips)
    })
})
//add a new park 



//get a specific trip
router.get('/trips/:userId/:id', (req, res, next) => {

})

// create a new trip 
router.post('/trips/:userId', (req, res, next) => {
    var trip = new Trip(req.params)
    Trip.create({
        name: trip.name,
        parks: []
    })
})

// function newBar(req, res) {
//     res.render('bars/new', {pageTitle: 'NEW BAR'});
//   }

//   function create(req, res) {
//     var bar = new Bar(req.body);
//     bar.save(err => {
//       res.redirect(`/bars/${bar.id}`);
//     });
//   }



// add to a trip
router.put('/trips/:userId/:id', )





// router.get('/:id', (req, res, next) => {
//     Park.findById(req.params.id)
//         .then(park => {res.json(park)});
// });

// router.get('/', (req, res, next) => {

// });


module.exports = router;