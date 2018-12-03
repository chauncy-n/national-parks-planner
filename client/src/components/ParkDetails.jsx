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

const DisplayParkImages = (props) => (
    <div>
        <ParkImage />
    </div>
)

const ParkDetails = (props) => (
    <div className="ParkDetails">
        <ParkInfo onePark={props.onePark}/>
        {props.onePark.images.map((image,index) => 
            <ParkImage
                        image ={image.url}
                        key= {index}        
            />)}
            {console.log(props.onePark.images[0].url)}
            {console.log(props.onePark.images)}

    </div>
)

export default ParkDetails;

