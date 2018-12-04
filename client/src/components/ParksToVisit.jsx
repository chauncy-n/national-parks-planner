import React from 'react';


class ParksToVisit extends React.Component {
    componentDidMount() {
        this.props.getUserTrips()
    }
    // let trips = props.getUserTrips()
    render() {
        const trips = this.props.trips.map( (trip, i) => <p 
        key={i}>
        {trip.name}
        {trip.parks}
        </p>)
        return (
                <div>
                    <h2>Parks I want to go to</h2>
                    {trips}
                </div>
            )
        }
}

export default ParksToVisit; 