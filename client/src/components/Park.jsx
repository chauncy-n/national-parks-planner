import React from 'react';
import '../App.css';

const Park = (props) => (
    <div className="Park"> 
        {/* <h1>Picture of park and its name with a link to details</h1> */}
        <img src={props.park.images[0].url}/>
        <p>{props.park.name}</p>
        {console.log(props.park.name)}
    </div>

)

export default Park;

