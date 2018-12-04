import React from 'react';

const AddParkToTrip = ({key, addParkToTrip, trip, onePark}) => (

    <button  onClick={() => addParkToTrip(onePark.name, trip._id)} >Add park to {trip.name}</button> 
)


export default AddParkToTrip; 