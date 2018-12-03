import React from 'react';


const ParkInfo = (props) => (
    <div className="ParkInfo">
    <h1>{props.onePark.name} Park details and images</h1>
        <p>{props.onePark.description}</p>
        <p>States:{props.onePark.states} </p>
    </div>
)

const ParkImage = ({images}) => (
    <div className="ParkImage">
        {/* {props.onePark.name} */}
        {/* <img className="ParkImage" src={images[0].url}></img> */}
    </div>
)

const DisplayParkImages = (props) => (
    <div>
        <ParkImage />
    </div>
)

const ParkDetails = (props) => (
    <div className="ParkDetails">
        <ParkInfo onePark={props.onePark}/>
        <DisplayParkImages images={props.onePark.images}/>

    </div>
)

export default ParkDetails;

