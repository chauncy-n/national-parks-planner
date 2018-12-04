import React from 'react';

const AddParkToTrip = ({key, addParkToTrip, name, onePark}) => (

    <button  onClick={() => addParkToTrip(onePark.name)} >Add park to {name}</button> 
)


export default AddParkToTrip; 