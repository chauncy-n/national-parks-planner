import React from 'react';
// import AddParkToTrip from './AddParkToTrip'

const ParkInfo = (props) => (
    <div className="ParkInfo">
    <h1>{props.onePark.name} Park details and images</h1>
        <p>{props.onePark.description}</p>
        <p>States:{props.onePark.states} </p>
    </div>
)

const ParkImage = ({image, key}) => (
    <div className="Park">
        <img className="ParkImage" src={image}></img>
    </div>
)

const AddParkToTrip = ({key, addParkToTrip, name}) => (
    // console.log(props, "fffffffffffff")
    <button  onClick={() => addParkToTrip()} >Add Park to this trip {name}</button> 
)
const ParkDetails = (props) => {
    return (
        <div className="ParkDetails">
            <ParkInfo onePark={props.onePark}/>
            {props.onePark.images.map((image,index) => 
                <ParkImage
                            image ={image.url}
                            key= {index}        
                />)}
            {props.trips.map((trip, index) =>     
            <AddParkToTrip 
                key={index}
                addParkToTrip= {props.addParkToTrip} 
                name={trip.name} 
                />
            )}    
        </div>
    )
}
// {props.allParks.data.map((park, index) => 
//     <Park
//         image = {park.images[0]}
//         name = {park.name}
//         key ={index}
//         onClick={() => props.handleDetailsClick(park.name)}
//         >
//     </Park>)}





export default ParkDetails;

