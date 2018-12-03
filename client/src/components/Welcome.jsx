import React from 'react';
import Park from './Park';


// add park code variable ?
const Welcome = (props) => {
    return (
    <div>
        <h1>Welcome to the Welcome page</h1>
            {props.allParks.data.map((park, index) => 
            <Park
                image = {park.images[0]}
                name = {park.name}
                key ={index}
                onClick={() => props.handleDetailsClick(park.name)}
                >
            </Park>)}

    </div>
    )
    }

export default Welcome;

