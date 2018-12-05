import React from 'react';


class ParksToVisit extends React.Component {
    componentDidMount() {
        this.props.getUserTrips()
    }
    render() {
        // need to display trip name and then map over parks to get each park
        const trips = this.props.trips.map( (trip, i) => (
        <div key={i}>
            <h2>{trip.name}</h2>
            <button addTrip={this.props.addTrip}> add a new trip</button>
            {trip.parks.map((park, index) => 
                <p key={index}park={park.parkName}>
                    {park.parkName} <button onClick={() => 
                    this.props.removeParkFromTrip(trip, park)}>Remove this park</button>
                </p>
            )}
        </div>))
        return (
                <div>
                    <h2>Parks I want to go to</h2>
                    {trips}
                </div>
            )
        }
}

export default ParksToVisit; 


// {props.trips.map((trip, index) =>     
//     <AddParkToTrip 
//         key={index}
//         addParkToTrip= {props.addParkToTrip} 
//         trip={trip} 
//         onePark={props.onePark}
//         />
//     )}    