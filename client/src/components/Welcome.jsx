import React from 'react';
import Park from './Park';


const Welcome = (props) => {
    console.log(props)
    return (
    <div>
        <h1>Welcome to the Welcome page</h1>
        <p>{console.log(props.allParks, 'hi')}</p>
            {props.allParks.data.map((park, index) => 
            <Park
                park = {park}
                key ={index}

            />)}
    </div>
    )
    }

export default Welcome;

