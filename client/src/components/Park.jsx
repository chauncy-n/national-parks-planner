import React from 'react';
import '../App.css';
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom';

const Park = (props) => (
    <div className="Park">
            
            <Link to={`/park-details/${props.park.name}`}>
            <img className="ParkImage" src={props.park.images[0].url} alt="park photo unavailable"/>
            </Link> 

            <p className="parkInfo">{props.park.name} props.</p>
            
    </div>

)

export default Park;

