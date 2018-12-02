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
      handleClick:this.handleClick
    }
    this.checkForLocalToken = this.checkForLocalToken.bind(this)
    this.logout = this.logout.bind(this)
    this.liftTokenToState = this.liftTokenToState.bind(this)
    this.handleClick = this.handleClick.bind(this)
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
  // I think this is where to call the api 
  // where does the Trip model come in 
  componentDidMount() {
    this.checkForLocalToken()
    fetch("https:developer.nps.gov/api/v1/parks?limit=500&q=National%20Park&api_key=uwTVV65WHASDuGuVL9dZjoNDIO7OrW6q11S7rp7r&fields=images")
    // .then(res => { return res.json())
    .then(res => {
      return res.json();
    })
    // .then(function(res) { return res.json() })

    .then(json => {
      console.warn(json)
      return this.setState({allParks: json})
    })
    
  }
  handleClick = (id) => {
    fetch(`/api/parks/${id}`)
      .then(res => res.json())
      .then(json => this.setState({onePark: json}))
  }

  // <Route exact path='/' render={() =>
  //   <GamePage
  //     colors={this.state.colors}


  render() {
    let user = this.state.user
    if (user) {
      return (
        <Router>
          <div className="App">
            <NavBar user={user} checkForLocalToken={this.checkForLocalToken} logout={this.logout}></NavBar>
            {console.log(this.state.allParks)}
            {/* {JSON.stringify(this.state.allParks)} */}
            <div className="content-box">
              <Route exact path="/" render={()=>
                <Welcome allParks= {this.state.allParks}/>
                
              } />
              <Route path="/park-details" component={ParkDetails} />
              <Route path="/parks-to-visit" component={ParksToVisit}/>
              {/* <p><a onClick={this.handleClick}>Test the protected route. Results below...</a></p>
              <p>{this.state.lockedResult}</p> */}
            </div>
          </div>
        </Router>
      );
    } else {
      return (
        <div className="App">
          <h1>Please sign up or sign in</h1>
          <div className="content-box">
            <Signup liftToken={this.liftTokenToState} />
            <Login liftToken={this.liftTokenToState} />
          </div>
        </div>
      )
    }
  }
}

export default App;
