import React from 'react';


const ParkInfo = (props) => (
    <div>
        <h3>Park info</h3>
        <p>lots of words, discription maybe contact info anything else etc.</p>
    </div>
)

const ParkImage = (props) => (
    <div className="ParkImage">
        <h1>This should be an image</h1>
    </div>
)

const DisplayParkImages = (props) => (
    <div>
        <ParkImage />
    </div>
)

const ParkDetails = (props) => (
    <div className="ParkDetails">
        <h1>Park details and images</h1>
        <ParkInfo />
        <DisplayParkImages />
    </div>
)

export default ParkDetails;