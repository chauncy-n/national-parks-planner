import React from 'react';
import Park from './Park';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from 'react-router-dom';
  

// add park code variable ?
const Welcome = (props) => {
    console.log(props)
    return (
    <div>
        <h1>Welcome to the Welcome page</h1>
            {props.allParks.data.map((park, index) => 
            <Park
                park = {park}
                key ={index}
                >
            </Park>)}
    </div>
    )
    }

export default Welcome;

