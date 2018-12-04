import React from 'react';


class AddParkToTrip extends React.Component {
    componentDidMount() {
        this.props.getUserTrips()
        this.props.addParkToTrip()
    }
    render() {
        const trips = this.props.trips.map((trip, index) => 
            <button  
            onClick={() => this.props.addParkToTrip()} 
                            key={index}
                            >Add Park to this trip {trip.name}</button>)
                return(
                    {trips}
                )
        }
    }
    // {props.trips.map((trip, index) => 
        
    //     <button  onClick={() => props.addParkToTrip()} key={index}>Add Park to this trip {trip.name}</button>
    // )}
//}

//         const trips = this.props.trips.map( (trip, i) => <p 
//         key={i}>
//         {trip.name}
//         {trip.parks}
//         </p>)
//         return (
//                 <div>
//                     <h2>Parks I want to go to</h2>
//                     {trips}
//                 </div>
//             )
//         }
// }
// {props.allParks.data.map((park, index) => 
//     <Park
//         image = {park.images[0]}
//         name = {park.name}
//         key ={index}
//         onClick={() => props.handleDetailsClick(park.name)}
//         >
//     </Park>)}


export default AddParkToTrip; 