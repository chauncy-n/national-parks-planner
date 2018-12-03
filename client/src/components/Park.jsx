import React from 'react';
import '../App.css';
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom';

const Park = ({image, name, onClick}) => (
    <div className="Park">
            <Link to={`/park-details/${name}`}>
                <img className="ParkImage" src={image.url} alt="park photo unavailable" onClick={onClick}/>
            </Link> 
            <p className="parkName">{name} </p>
    </div>

)

export default Park;

