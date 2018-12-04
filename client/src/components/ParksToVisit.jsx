import React from 'react';


const ParksToVisit = (props) => {
    let trips = props.getUserTrips()
    console.log(trips)
    return (
        <div>
            <h2>Parks I want to go to</h2>

        </div>
    )
}

export default ParksToVisit; 