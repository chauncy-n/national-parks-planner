import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import Login from './Login';
import Signup from './Signup';
// import {UserProfile} from './UserProfile';
import NavBar from './components/NavBar';
import Welcome from './components/Welcome';
import ParkDetails from './components/ParkDetails';
import ParksToVisit from './components/ParksToVisit';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';



class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      token: '',
      user: null,
      error: null,
      lockedResult: '',
      allParks: {data:[]},
      onePark: null,
      trips: []
    }
    this.checkForLocalToken = this.checkForLocalToken.bind(this)
    this.logout = this.logout.bind(this)
    this.liftTokenToState = this.liftTokenToState.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleDetailsClick = this.handleDetailsClick.bind(this)
  }

  liftTokenToState(data) {
    this.setState({
      token: data.token,
      user: data.user
    })
  }

  handleClick(e) {
    e.preventDefault()
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.state.token
    axios.get('/locked/test').then(result => {
      this.setState({
        lockedResult: result.data
      })
    })
  }

  logout() {
    // Remove the token from localStorage
    localStorage.removeItem('mernToken')
    // Remove the user info from the state
    this.setState({
      token: '',
      user: null
    })
  }

  checkForLocalToken() {
    // Look in local storage for the token
    let token = localStorage.getItem('mernToken')
    if (!token || token === 'undefined') {
      // There was no token
      localStorage.removeItem('mernToken')
      this.setState({
        token: '',
        user: null
      })
    } else {
      // We did find a token in localStorage
      // Send it to the back to be verified
      axios.post('/auth/me/from/token', {
        token
      }).then( result => {
        if (result.data.type !== 'success') {
          this.setState({
            error: result.data
          })
        } else {
          // Put the token in localStorage
          localStorage.setItem('mernToken', result.data.token)
          this.setState({
            token: result.data.token,
            user: result.data.user
          })
        }
      })
    }
  }

  componentDidMount() {
    this.checkForLocalToken()
    fetch("https://developer.nps.gov/api/v1/parks?limit=500&q=National%20Park&api_key=uwTVV65WHASDuGuVL9dZjoNDIO7OrW6q11S7rp7r&fields=images")
    .then(res => {
      return res.json();
    })
    .then(json => {
      return this.setState({allParks: json}, () => {
        if (this.state.user)this.getUserTrips();
      })
    })
  }

  updateTrip = (res) => {
    let trips = this.state.trips
    let newTrips = trips.map(trip => {
      if (trip._id == res.data._id) {
        return res.data
      } else {
        return trip
      }
    })
    this.setState({trips: newTrips})
  }

  getUserTrips = () => {
    if (this.state.user) {
      axios.get(`/api/trips/${this.state.user._id}`)
        .then( res => this.setState({trips: res.data}))
        .catch( err => console.log(err))
    } else {
      console.log('Chauncy is good')
    }
  }

  handleDetailsClick = (id) => {
    let park = this.state.allParks.data.find(park => park.name === id)
    this.setState({onePark: park})
  }

  addParkToTrip = (park, id) => {
    let tripInfo = {park: park, id: id}
    axios.post(`/api/trips/${id}`, tripInfo )
    .then(res => this.updateTrip(res))
  }

  removeParkFromTrip = (trip, park) => {

    axios.delete(`/api/trips/${trip._id}/parks/${park.parkName}`)
    .then(res => this.updateTrip(res))
  }
  addTrip = (trip) => {
    let tripInfo = {trip: trip}
    axios.post(`/api/trips/new`, tripInfo )
    // create trip ?
    //.then(res => this.updateTrip(res))
  }

  render() {
    let user = this.state.user
    if (user) {
      return (
      
        <Router>
          <div className="App">
            <NavBar user={user} checkForLocalToken={this.checkForLocalToken} logout={this.logout}></NavBar>
              <div className="contentBox">
                <Switch>
                  <Route exact path="/" render={()=>
                    <Welcome allParks= {this.state.allParks}
                              handleDetailsClick ={this.handleDetailsClick}
                    />  
                  } />
                  <Route path="/park-details/:id" render={(props) =>
                    <ParkDetails onePark={this.state.onePark}  id={props.match.params.id} 
                    addParkToTrip={this.addParkToTrip} trips={this.state.trips} />
                    }/>
                  <Route path="/parks-to-visit" render={(props) => 
                      <ParksToVisit 
                      getUserTrips={this.getUserTrips}
                      trips={this.state.trips}  
                      removeParkFromTrip={this.removeParkFromTrip}
                      addTrip={this.addTrip}
                      />
                  }/>
                  <Route path="*" render={()=> <h1>Not Found</h1>} />
                </Switch>
              </div>
            </div>
          </Router>
        
      );
    } else {
      return (
        <div className="App">
          <h1>Please sign up or sign in</h1>
          <div className="contentBox">
            <Signup liftToken={this.liftTokenToState} />
            <Login liftToken={this.liftTokenToState} />
          </div>
        </div>
      )
    }
  }
}

export default App;

// TO DO:

// - mechanism to add park to trip
// - update user.trips in db => refresh user.trips in app


