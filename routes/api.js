const express = require('express');
const router = express.Router();
//const  Trip =  require('../models/Trip');


router.get('/', (req, res, next) => {
    Park.find({})
    .then(parks => {res.json(parks)});
});

router.get('/:id', (req, res, next) => {
    Park.findById(req.params.id)
        .then(park => {res.json(park)});
});

module.exports = router;