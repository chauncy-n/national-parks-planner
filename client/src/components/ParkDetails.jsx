import React from 'react';


const ParkInfo = (props) => (
    <div className="ParkInfo">
    <h1>{props.onePark.name} Park details and images</h1>
        <p>{props.onePark.description}</p>
        <p>States:{props.onePark.states} </p>
    </div>
)

const ParkImage = ({image}) => (
    <div className="Park">
        <img className="ParkImage" src={image}></img>
    </div>
)

const AddParkToTrip = (props) => (
    <button onClick={() => props.addParkToTrip()}>this is a button</button>
            //  onClick={() => props.handleDetailsClick(park.name)}
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
            <AddParkToTrip addParkToTrip= {props.addParkToTrip} />
        </div>
    )
}

export default ParkDetails;

