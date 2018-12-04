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
      onePark: null
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
      return this.setState({allParks: json})
    })
  }

  getUserTrips = () => {
    console.log(`getUserTrips: hasGrabbedTrips = ${this.state.hasGrabbedTrips}, trips = ${this.state.userTrips}`)
    if (!this.state.hasGrabbedTrips) {
      this.setState({hasGrabbedTrips: true})
      axios.get(`/api/trips/${this.state.user.id}`).then(res => {
        console.log("Got a response:")
        console.log(res)
        this.setState({trips: res.json()})
      }).catch(error => console.error(error))
    }
    return this.state.trips
  }

  handleDetailsClick = (id) => {
    let park = this.state.allParks.data.find(park => park.name === id)
    this.setState({onePark: park})

    console.log(this.state.onePark)
    console.log(park)
  }

  addParkToTrip = (park) => {
    console.log("hi")
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
                    addParkToTrip={this.addParkToTrip}/>
                    }/>
                  <Route path="/parks-to-visit" render={(props) => 
                      <ParksToVisit getUserTrips={this.getUserTrips}/>
                  }/>
                  <Route path="*" render={()=> <h1>Not Found</h1>} />
                </Switch>
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


// var parks = {
//   "total": 88,
//   "data": [
//       {
//           "states": "CT,GA,MA,MD,ME,NC,NH,NJ,NY,PA,TN,VA,VT,WV",
//           "directionsInfo": "There are many points of access along the Appalachian Trail, whether it is by car, train, bus or plane. For more detailed directions, please refer to the \"Directions\" section of our park webpage.",
//           "directionsUrl": "http://www.nps.gov/appa/planyourvisit/directions.htm",
//           "url": "https://www.nps.gov/appa/index.htm",
//           "weatherInfo": "It is your responsibility to be prepared for all weather conditions, including extreme and unexpected weather changes year-round. As the trail runs from Georgia to Maine there will be different weather conditions depending on your location. For weather along specific sections of the trail and at specific shelters, please refer to: http://www.atweather.org/",
//           "name": "Appalachian",
//           "latLong": "lat:40.41029575, long:-76.4337548",
//           "description": "The Appalachian Trail is a 2,180+ mile long public footpath that traverses the scenic, wooded, pastoral, wild, and culturally resonant lands of the Appalachian Mountains. Conceived in 1921, built by private citizens, and completed in 1937, today the trail is managed by the National Park Service, US Forest Service, Appalachian Trail Conservancy, numerous state agencies and thousands of volunteers.",
//           "images": [
//               {
//                   "credit": "Photo Credit: ATC/Benjamin Hays",
//                   "altText": "Silhouette of a man with backpack standing on McAfee Knob at sunset with mountains in the distance.",
//                   "title": "McAfee Knob",
//                   "id": 3801,
//                   "caption": "McAfee Knob is one of the most popular locations along the A.T. to take photographs.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C8397D6-1DD8-B71B-0BEF4C54462A1EB3.jpg"
//               },
//               {
//                   "credit": "Photo Credit: ATC",
//                   "altText": "The Appalachian Trail runs across a mountain ridge line with views to the horizon of mountain range.",
//                   "title": "Appalachian Trail",
//                   "id": 3807,
//                   "caption": "Crossing into thirteen states, hikers experience a variety of scenery along the way.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C83A128-1DD8-B71B-0B02DED286AFD8C6.jpg"
//               },
//               {
//                   "credit": "Photo Credit: ATC/Matthew Davis",
//                   "altText": "A white blaze marks a tree in the foreground, with a man and child walking away on the wooded trail.",
//                   "title": "The Infamous White Blaze of the A.T.",
//                   "id": 3808,
//                   "caption": "The white blaze marks the Appalachian Trail as a way for hikers to identify the route.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C83A2B0-1DD8-B71B-0B4589220F4D60D9.jpg"
//               },
//               {
//                   "credit": "Photo Credit: Maine Appalachian Trail Club",
//                   "altText": "A volunteer is carrying a split log while walking across a wooden footbridge in the woods.",
//                   "title": "Volunteer on the A.T.",
//                   "id": 3809,
//                   "caption": "The Appalachian Trail is maintained largely by volunteers.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C83A442-1DD8-B71B-0BD0A5F2BD69B9F6.jpg"
//               },
//               {
//                   "credit": "Photo Credit: ATC/Greg Walter",
//                   "altText": "A snowy winter view from the A.T. overlooking snowy mountains and clouds in the distance.",
//                   "title": "Winter on the A.T.",
//                   "id": 3810,
//                   "caption": "Hikers can experience many seasons along the A.T. all year round. It is important to be prepared.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C83A59A-1DD8-B71B-0BBFB87BBDDAABD6.jpg"
//               }
//           ],
//           "designation": "National Scenic Trail",
//           "parkCode": "appa",
//           "id": "FAEF5684-83A4-4CF2-A701-60CF8D4014BD",
//           "fullName": "Appalachian National Scenic Trail"
//       },
//       {
//           "states": "UT",
//           "directionsInfo": "Arches National Park is located in southeast Utah, five miles north of Moab on US 191.\n\nFrom Moab, Utah, drive five miles north on Main Street/US 191. Turn right at the stoplight.\n\nFrom Interstate 70, take exit 182 (Crescent Junction), then drive south 28 miles on US 191. Turn left at the stoplight.",
//           "directionsUrl": "http://www.nps.gov/arch/planyourvisit/directions.htm",
//           "url": "https://www.nps.gov/arch/index.htm",
//           "weatherInfo": "Arches is part of the Colorado Plateau, a \"high desert\" region that experiences wide temperature fluctuations, sometimes over 40 degrees in a single day. The temperate (and most popular) seasons are spring (April-May) and fall (mid-September-October), when daytime highs average 60 to 80 F and lows average 30 to 50 F. Summer temperatures often exceed 100 F, making strenuous exercise difficult. Winters are cold, with highs averaging 30 to 50 F, and lows averaging 0 to 20 F.",
//           "name": "Arches",
//           "latLong": "lat:38.72261844, long:-109.5863666",
//           "description": "Visit Arches to discover a landscape of contrasting colors, land forms and textures unlike any other in the world. The park has over 2,000 natural stone arches, in addition to hundreds of soaring pinnacles, massive fins and giant balanced rocks. This red-rock wonderland will amaze you with its formations, refresh you with its trails, and inspire you with its sunsets.",
//           "images": [
//               {
//                   "credit": "NPS/Neal Herbert",
//                   "altText": "a stone monolith reflected in standing water",
//                   "title": "The Organ with Potholes",
//                   "id": 163,
//                   "caption": "The Organ rock formation is reflected in one of many natural potholes.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C79850F-1DD8-B71B-0BC4A88BA85DE6B0.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "a broad, red arch with rock pinnacles in the background",
//                   "title": "Double O Arch",
//                   "id": 174,
//                   "caption": "Double O Arch is one of many large arches in the Devils Garden area",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C79931C-1DD8-B71B-0BF201E3DB540D04.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "a stone arch",
//                   "title": "Delicate Arch",
//                   "id": 271,
//                   "caption": "Delicate Arch is perhaps the most famous natural arch in the world.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7A0B2B-1DD8-B71B-0BE0E26B0740AA6B.jpg"
//               },
//               {
//                   "credit": "NPS/Wonderly",
//                   "altText": "the Milky Way arcs above silhouetted stone pinnacles",
//                   "title": "Milky Way over the Garden of Eden",
//                   "id": 272,
//                   "caption": "Arches offers some excellent night sky viewing.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7A0C49-1DD8-B71B-0B460D58D6E83B40.jpg"
//               },
//               {
//                   "credit": "NPS/Herbert",
//                   "altText": "two hikers descend a broad wash with tall rock walls on either side.",
//                   "title": "Park Avenue Trail",
//                   "id": 273,
//                   "caption": "The Park Avenue trail is one of many hiking trails at Arches, ranging from easy to strenuous.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7A0DE5-1DD8-B71B-0BFBE720788EF4A3.jpg"
//               }
//           ],
//           "designation": "National Park",
//           "parkCode": "arch",
//           "id": "36240051-018E-4915-B6EA-3F1A7F24FBE4",
//           "fullName": "Arches National Park"
//       },
//       {
//           "states": "SD",
//           "directionsInfo": "Badlands National Park is located 75 miles east of Rapid City, South Dakota.\n\nPhysical Addresses for GPS*\n\nPark Headquarters: 25216 Ben Reifel Road, Interior, SD 57750.\nNortheast Entrance (I-90, Exit 131): 21020 SD Hwy 240, Interior, SD 57750.\nPinnacles Entrance (I-90, Exit 110): 24240 Hwy 240, Wall, SD 57790.\nInterior Entrance: 20640 SD Hwy 377, Interior, SD 57750.",
//           "directionsUrl": "http://www.nps.gov/badl/planyourvisit/directions.htm",
//           "url": "https://www.nps.gov/badl/index.htm",
//           "weatherInfo": "The Badlands weather is variable and unpredictable with temperature extremes ranging from 116° F to -40° F. Summers are hot and dry with occasional violent thunderstorms. Hailstorms and occasional tornadoes can descend on the Badlands with sudden fury. Winters are typically cold with 12 to 24 inches of total snowfall.",
//           "name": "Badlands",
//           "latLong": "lat:43.68584846, long:-102.482942",
//           "description": "The rugged beauty of the Badlands draws visitors from around the world. These striking geologic deposits contain one of the world’s richest fossil beds. Ancient mammals such as the rhino, horse, and saber-toothed cat once roamed here. The park’s 244,000 acres protect an expanse of mixed-grass prairie where bison, bighorn sheep, prairie dogs, and black-footed ferrets live today.",
//           "images": [
//               {
//                   "credit": "NPS Photo",
//                   "altText": "A badlands formation peeks out out of the prairie.",
//                   "title": "Badlands",
//                   "id": 3673,
//                   "caption": "A badlands formation peeks out out of the prairie.",
//                   "url": "https://www.nps.gov/customcf/structured_data/upload/5853560268_bce0ab5b6c_o.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "Badlands erosion rates are very rapid, an inch a year on average.",
//                   "title": "Badlands Erosion",
//                   "id": 3676,
//                   "caption": "Badlands erosion rates are very rapid, an inch a year on average.",
//                   "url": "https://www.nps.gov/customcf/structured_data/upload/5881491202_1e35d1a703_o.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "Badlands formations are very rugged and often have sharp peaks.",
//                   "title": "Badlands Rugged Peaks",
//                   "id": 3677,
//                   "caption": "Badlands formations are very rugged and often have sharp peaks.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C82EBFE-1DD8-B71B-0B21072718DB2A95.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "The yellow mounds are peaking out of the formations in this photo.",
//                   "title": "Badlands Yellow Mounds",
//                   "id": 3678,
//                   "caption": "The yellow mounds are peaking out of the formations in this photo.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C82ED5D-1DD8-B71B-0B2F33D3B39D6D1B.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "The yellow mounds are peaking out of the formations in this photo.",
//                   "title": "Badlands Storm",
//                   "id": 3679,
//                   "caption": "The yellow mounds are peaking out of the formations in this photo.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C82EE63-1DD8-B71B-0BD6EE0FDCB5D402.jpg"
//               }
//           ],
//           "designation": "National Park",
//           "parkCode": "badl",
//           "id": "B170CCF7-7AB9-48FF-950E-31815FD4DBB2",
//           "fullName": "Badlands National Park"
//       },
//       {
//           "states": "TX",
//           "directionsInfo": "Hwy 118 south from Alpine; Hwy 385 south from Marathon; FM 170 from Presidio through Study Butte.",
//           "directionsUrl": "http://www.nps.gov/bibe/planyourvisit/directions.htm",
//           "url": "https://www.nps.gov/bibe/index.htm",
//           "weatherInfo": "Variable\n-- February through April the park abounds with pleasant and comfortable temperatures.\n-- May through August is hot and can also be stormy. Temperatures regularly reach well over 100 degrees in the lower elevations and along the Rio Grande.\n-- September through January temperatures are cooler; the weather can quickly turn cold at any time during these months.",
//           "name": "Big Bend",
//           "latLong": "lat:29.29817767, long:-103.2297897",
//           "description": "There is a place in Far West Texas where night skies are dark as coal and rivers carve temple-like canyons in ancient limestone. Here, at the end of the road, hundreds of bird species take refuge in a solitary mountain range surrounded by weather-beaten desert. Tenacious cactus bloom in sublime southwestern sun, and diversity of species is the best in the country. This magical place is Big Bend...",
//           "images": [
//               {
//                   "credit": "NPS Photo/Cookie Ballou",
//                   "altText": "An ocotillo grows in the foreground and a pastel desert with bright green shrubs in the background",
//                   "title": "Desert Vista",
//                   "id": 4037,
//                   "caption": "Desert Vista from Dorgan House",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C84EF64-1DD8-B71B-0B44D9F693CAA78C.jpg"
//               },
//               {
//                   "credit": "NPS Photo/Cookie Ballou",
//                   "altText": "Adult javelina, or collared peccary, and two young javelinas forage in a rocky area.",
//                   "title": "Javelina and Young",
//                   "id": 4038,
//                   "caption": "A female javelina, or collared peccary, and her young, often called reds because of the color of their hair when very young.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C84F0B8-1DD8-B71B-0BE8B78FCC3B52A3.jpg"
//               },
//               {
//                   "credit": "NPS Photo/Ann Wildermuth",
//                   "altText": "View of a river snaking through a desert landscape.",
//                   "title": "River Vista",
//                   "id": 4039,
//                   "caption": "View of the Rio Grande River in Big Bend National Park.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C84F209-1DD8-B71B-0B6AA2D4E9522573.jpg"
//               },
//               {
//                   "credit": "NPS Photo/Cookie Ballou",
//                   "altText": "Two lane road disappears into the horizon in a desert landscape.",
//                   "title": "Ross Maxwell Scenic Drive",
//                   "id": 4040,
//                   "caption": "Ross Maxwell Scenic Drive in Big Bend National Park",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C84F37F-1DD8-B71B-0B1EBFE7049A7274.jpg"
//               },
//               {
//                   "credit": "NPS Photo/Reine Wonite",
//                   "altText": "Bright red claret cup cactus flowers bloom with a mountainous desert landscape in the background.",
//                   "title": "South Rim Vista",
//                   "id": 4041,
//                   "caption": "South Rim Vista and Claret Cup Cactus",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C84F4D3-1DD8-B71B-0B2F905EF012D45A.jpg"
//               }
//           ],
//           "designation": "National Park",
//           "parkCode": "bibe",
//           "id": "C9056F71-7162-4208-8AE9-2D0AEFA594FD",
//           "fullName": "Big Bend National Park"
//       },
//       {
//           "states": "FL",
//           "directionsInfo": "The Dante Fascell Visitor Center may be reached from the Florida Turnpike by taking Exit 6 (Speedway Boulevard). Turn left from exit ramp and continue south to SW 328th Street (North Canal Drive). Turn left on 328th Street and continue for four miles to the end of the road. The park entrance is on the left just before the entrance to Homestead Bayfront Marina.",
//           "directionsUrl": "http://www.nps.gov/bisc/planyourvisit/directions.htm",
//           "url": "https://www.nps.gov/bisc/index.htm",
//           "weatherInfo": "The park is situated in a subtropical climate, which ensures sunshine year-round. Winters are normally dry and mild, with occasional fronts bringing wind and little rain. Summer brings hot and humid weather with scattered thunderstorms in the afternoons. The average temperature in January is 68 degrees Fahrenheit and 82 in July. The average rainfall for the area is 2.17 inches in January and 3.95 inches in July. June to November is hurricane season.",
//           "name": "Biscayne",
//           "latLong": "lat:25.490587, long:-80.21023851",
//           "description": "Within sight of downtown Miami, yet worlds away, Biscayne protects a rare combination of aquamarine waters, emerald islands, and fish-bejeweled coral reefs. Here too is evidence of 10,000 years of human history, from pirates and shipwrecks to pineapple farmers and presidents. Outdoors enthusiasts can boat, snorkel, camp, watch wildlife…or simply relax in a rocking chair gazing out over the bay.",
//           "images": [
//               {
//                   "credit": "NPS photo",
//                   "altText": "Downtown Miami in background.",
//                   "title": "Boca Chita Key",
//                   "id": 4382,
//                   "caption": "Boca Chita Key is the park's most popular island destination.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C870533-1DD8-B71B-0B70CFF5EF6538F1.jpg"
//               },
//               {
//                   "credit": "NPS photo",
//                   "altText": "The coral reefs are located mostly on the Eastern side of the park.",
//                   "title": "Coral Reef",
//                   "id": 4383,
//                   "caption": "Biscayne National Park is 95% water.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C870833-1DD8-B71B-0BE93D49E0DF6503.jpg"
//               },
//               {
//                   "credit": "NPS photo",
//                   "altText": "Green sea turtle",
//                   "title": "Green sea turtle",
//                   "id": 4384,
//                   "caption": "Loggerhead, Green and Hawksbill turtles are all commonly observed in park waters.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C870A07-1DD8-B71B-0B9BA7F6549AD537.jpg"
//               },
//               {
//                   "credit": "NPS photo",
//                   "altText": "Aerial view of Totten Key.",
//                   "title": "Totten Key",
//                   "id": 4390,
//                   "caption": "Biscayne National Park includes the northernmost Florida Keys.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C871441-1DD8-B71B-0BBD1985ADA0E585.jpg"
//               },
//               {
//                   "credit": "NPS image",
//                   "altText": "snorkeling is an easy-to-learn skill",
//                   "title": "Snorkeling",
//                   "id": 4392,
//                   "caption": "Experience the park's shallow reefs up close and personal by snorkeling with some of the park's most colorful wildlife.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C8717A4-1DD8-B71B-0B2EED68CFA7E008.jpg"
//               }
//           ],
//           "designation": "National Park",
//           "parkCode": "bisc",
//           "id": "FBF9F793-5114-4B61-A5BA-6F9ADDFDF459",
//           "fullName": "Biscayne National Park"
//       },
//       {
//           "states": "CO",
//           "directionsInfo": "7 miles north on CO Highway 347 from the intersection with U.S. Highway 50 east of Montrose",
//           "directionsUrl": "http://www.nps.gov/blca/planyourvisit/directions.htm",
//           "url": "https://www.nps.gov/blca/index.htm",
//           "weatherInfo": "Today's Weather: http://www.weather.com/weather/today/l/NPBLCA:13:US\n\nCLIMATE\nWeather can vary greatly throughout the day. Summer daytime temperatures range between 55 to 90F (13 to 32C), nights 45 to 60F (7 to 16C). Winter daytime temperatures range between 15 to 40F (-9 to 4C), nights 10 to 20F (-12 to -6C).\n\nAfternoon thunderstorms are common during the summer. Snow accumulation varies greatly year to year. Layered clothing appropriate for the season is recommended.",
//           "name": "Black Canyon Of The Gunnison",
//           "latLong": "lat:38.57779869, long:-107.7242756",
//           "description": "Big enough to be overwhelming, still intimate enough to feel the pulse of time, Black Canyon of the Gunnison exposes you to some of the steepest cliffs, oldest rock, and craggiest spires in North America. With two million years to work, the Gunnison River, along with the forces of weathering, has sculpted this vertical wilderness of rock, water, and sky.",
//           "images": [
//               {
//                   "credit": "NPS Photo/Lynch",
//                   "altText": "Black Canyon near Tomichi Point",
//                   "title": "Black Canyon near Tomichi Point",
//                   "id": 3402,
//                   "caption": "Black Canyon near Tomichi Point",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C81655F-1DD8-B71B-0B4BCFFDB74EE723.jpg"
//               },
//               {
//                   "credit": "NPS Photo/Lynch",
//                   "altText": "Black Canyon near Painted Wall",
//                   "title": "Black Canyon near Painted Wall",
//                   "id": 3403,
//                   "caption": "Black Canyon near Painted Wall",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C8166E8-1DD8-B71B-0BDEB9A4EEEED807.jpg"
//               }
//           ],
//           "designation": "National Park",
//           "parkCode": "blca",
//           "id": "BDBD573F-97EF-44E7-A579-471679F2C42A",
//           "fullName": "Black Canyon Of The Gunnison National Park"
//       },
//       {
//           "states": "UT",
//           "directionsInfo": "From the North:\nTake I-15 south to UT-20 (exit 95). Travel east on UT-20 to US-89. Follow US-89 south to UT-12. Travel east on UT-12 to UT-63. Take UT-63 south to Bryce Canyon National Park.\n\nFrom the South through Zion National Park:\nTake I-15 north to UT-9 (exit 16). Follow UT-9 east through Zion National Park to US-89. Travel north on US-89 to UT-12. Go east on UT-12 to UT-63. Take UT-63 south to Bryce Canyon National Park.",
//           "directionsUrl": "http://www.nps.gov/brca/planyourvisit/directions.htm",
//           "url": "https://www.nps.gov/brca/index.htm",
//           "weatherInfo": "http://forecast.weather.gov/MapClick.php?lat=37.63&lon=-112.17#.VpUamdHUhaR",
//           "name": "Bryce Canyon",
//           "latLong": "lat:37.58399144, long:-112.1826689",
//           "description": "Hoodoos (irregular columns of rock) exist on every continent, but here is the largest concentration found anywhere on Earth. Situated along a high plateau at the top of the Grand Staircase, the park's high elevations include numerous life communities, fantastic dark skies, and geological wonders that defy description.",
//           "images": [
//               {
//                   "credit": "NPS Photo / Brian B. Roanhorse February 24, 2015",
//                   "altText": "Bryce Canyon Visitor Center Toll booths in winter.",
//                   "title": "Bryce Canyon Visitor Center Toll Booths",
//                   "id": 3089,
//                   "caption": "Opening the gates at Bryce Canyon National Park under snow.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7F8B29-1DD8-B71B-0B5EA38E8C5E5606.jpg"
//               },
//               {
//                   "credit": "NPS Photo / Brian B. Roanhorse February 28, 2015",
//                   "altText": "Snow on the Queens Garden Trail.",
//                   "title": "Snow blanket On Queens Garden",
//                   "id": 3091,
//                   "caption": "Trail to Queens Garden is exceptional any day of the year.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7F8EAD-1DD8-B71B-0B080143E3A4984D.jpg"
//               },
//               {
//                   "credit": "Brian B. Roanhorse March 4, 2015",
//                   "altText": "Orange Hoodoos under snow cover.",
//                   "title": "Mossy Cave in Winter",
//                   "id": 3094,
//                   "caption": "Orange is the new look at Bryce.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7F9378-1DD8-B71B-0B4B29598AA967F4.jpg"
//               },
//               {
//                   "credit": "NPS Photo / Brian B. Roanhorse March 13, 2015",
//                   "altText": "Early morning snow at Thor' Hammer.",
//                   "title": "Thor's Hammer in Winter",
//                   "id": 3095,
//                   "caption": "Clear skys and snow drifts at Thor's Hammer.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7F9538-1DD8-B71B-0BA12D1447D43CE4.jpg"
//               },
//               {
//                   "credit": "Photographed by Brian B. Roanhorse NPS",
//                   "altText": "Paria View Point at Sunrise",
//                   "title": "Paria View Point at Sunrise",
//                   "id": 3844,
//                   "caption": "Paria View at sunrise.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C83D7D0-1DD8-B71B-0B799F6F8D0902D8.jpg"
//               }
//           ],
//           "designation": "National Park",
//           "parkCode": "brca",
//           "id": "6B1D053D-714F-46D1-B410-04BE868F14C1",
//           "fullName": "Bryce Canyon National Park"
//       },
//       {
//           "states": "UT",
//           "directionsInfo": "Canyonlands National Park is cut into three districts by the Green and Colorado rivers. Island in the Sky district, in the north of the park, is the closest district to Moab, UT. In about 40 minutes, you can reach Island in the Sky via UT 313. The Needles district is in the southeast corner of Canyonlands. The Needles is about an hour's drive from Monticello, UT via UT 211. The Maze district, in the west of the park, is the most remote and challenging. You can reach The Maze via unpaved roads from UT 24.",
//           "directionsUrl": "http://www.nps.gov/cany/planyourvisit/directions.htm",
//           "url": "https://www.nps.gov/cany/index.htm",
//           "weatherInfo": "Canyonlands is part of the Colorado Plateau, a \"high desert\" region that experiences wide temperature fluctuations, sometimes over 40 degrees in a single day. The temperate (and most popular) seasons are spring (April-May) and fall (mid-September-October), when daytime highs average 60 to 80 F and lows average 30 to 50 F. Summer temperatures often exceed 100 F, making strenuous exercise difficult. Winters are cold, with highs averaging 30 to 50 F, and lows averaging 0 to 20 F.",
//           "name": "Canyonlands",
//           "latLong": "lat:38.24555783, long:-109.8801624",
//           "description": "Canyonlands invites you to explore a wilderness of countless canyons and fantastically formed buttes carved by the Colorado River and its tributaries. Rivers divide the park into four districts: Island in the Sky, The Needles, The Maze, and the rivers themselves. These areas share a primitive desert atmosphere, but each offers different opportunities for sightseeing and adventure.",
//           "images": [
//               {
//                   "credit": "NPS/Neal Herbert",
//                   "altText": "a rugged canyon",
//                   "title": "The Maze",
//                   "id": 321,
//                   "caption": "The Maze is the most remote district of the park. Visiting requires four-wheel drive, self-reliance, and extra time.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7A4FC2-1DD8-B71B-0B13118C99270C08.jpg"
//               },
//               {
//                   "credit": "NPS/Neal Herbert",
//                   "altText": "a broad stone arch with rock pinnacles in the distance",
//                   "title": "Mesa Arch",
//                   "id": 322,
//                   "caption": "Mesa Arch, at Island in the Sky, is a great spot for photographers.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7A525D-1DD8-B71B-0B8E59D2EB39F6D0.jpg"
//               },
//               {
//                   "credit": "NPS/Neal Herbert",
//                   "altText": "shallow pools with a double rainbow in the background",
//                   "title": "Pothole Point",
//                   "id": 323,
//                   "caption": "Pothole Point Trail",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7A53BC-1DD8-B71B-0BFF7AD2A83FC7A8.jpg"
//               },
//               {
//                   "credit": "NPS/Neal Herbert",
//                   "altText": "a long gravel road with cyclists on it",
//                   "title": "White Rim Road",
//                   "id": 324,
//                   "caption": "The White Rim Road at Island in the Sky is a popular road for mountain bikers.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7A5534-1DD8-B71B-0B3887A48C037633.jpg"
//               },
//               {
//                   "credit": "NPS/Neal Herbert",
//                   "altText": "pinnacles of horizontally striped sandstone",
//                   "title": "The Needles in Chesler Park",
//                   "id": 325,
//                   "caption": "The Needles, pinnacles of Cedar Mesa Sandstone, are visible in many parts of the Needles District, including this view in Chesler Park.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7A5677-1DD8-B71B-0BD6CF7287668A78.jpg"
//               },
//               {
//                   "credit": "NPS/Neal Herbert",
//                   "altText": "a person rowing a dory on the Colorado River",
//                   "title": "Boating on the Colorado River",
//                   "id": 326,
//                   "caption": "Boating the Colorado and Green rivers is a popular activity at Canyonlands (permit required).",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7A5840-1DD8-B71B-0B3C87EB4677BFA5.jpg"
//               }
//           ],
//           "designation": "National Park",
//           "parkCode": "cany",
//           "id": "319E07D8-E176-41F8-98A9-1E3F8099D0AB",
//           "fullName": "Canyonlands National Park"
//       },
//       {
//           "states": "NM",
//           "directionsInfo": "To access the park's only entrance road, New Mexico Highway 7, turn north from US Hwy 62/180 at White's City, NM, which is 20 miles (32 km) southwest of Carlsbad, NM and 145 miles (233 km) northeast of El Paso, TX. The entrance road stretches a scenic seven miles (11.3 km) from the park gate at White's City to the visitor center and cavern entrance. The address for the park's visitor center is 727 Carlsbad Caverns Hwy, Carlsbad, NM, 88220, located 27 miles (43 km) from the town of Carlsbad.",
//           "directionsUrl": "http://www.nps.gov/cave/planyourvisit/directions.htm",
//           "url": "https://www.nps.gov/cave/index.htm",
//           "weatherInfo": "Carlsbad Caverns National Park is located in the Chihuahuan Desert in southeast New Mexico. Summers are hot with temperatures between 90°F (32°C) and low 100s °F (38°C). Windy conditions and mild temperatures are common in early spring (March-May) with frequent rain in early fall (August-September). This part of the country also sees cold temperatures in the winter with occasional snow and icy conditions. Most days, the park is enveloped by a gorgeous blue sky with very few clouds, 278 sunny days a year!",
//           "name": "Carlsbad Caverns",
//           "latLong": "lat:32.14089463, long:-104.5529688",
//           "description": "High ancient sea ledges, deep rocky canyons, flowering cactus, and desert wildlife—treasures above the ground in the Chihuahuan Desert. Hidden beneath the surface are more than 119 caves—formed when sulfuric acid dissolved limestone leaving behind caverns of all sizes.",
//           "images": [
//               {
//                   "credit": "NPS Photo by Peter Jones",
//                   "altText": "Looking up through the mouth of the cave on the Natural Entrance path.",
//                   "title": "The Natural Entrance",
//                   "id": 3552,
//                   "caption": "Beautiful view looking back out the Natural Entrance as you descend into the cave.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C82342F-1DD8-B71B-0BAD8438A2A16379.jpg"
//               },
//               {
//                   "credit": "NPS Photo by Peter Jones",
//                   "altText": "Visitors rest at the formation \"Rock of Ages.\"",
//                   "title": "Rock of Ages",
//                   "id": 3560,
//                   "caption": "Part of the Big Room tour, the \"Rock of Ages\" is a spectacular formation.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C8240F9-1DD8-B71B-0BB5EA000351CA8A.jpg"
//               },
//               {
//                   "credit": "NPS Photo by Peter Jones",
//                   "altText": "Visitors gathered in the outdoor amphitheater to experience bat flight.",
//                   "title": "A ranger presents a Bat Flight Program to hundreds of visitors.",
//                   "id": 3561,
//                   "caption": "Every summer evening visitors gather in the outdoor amphitheater to watch hundreds of thousands of bats leave on their nightly food forage.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C824291-1DD8-B71B-0B9FE94C336B796C.jpg"
//               },
//               {
//                   "credit": "NPS Photo by Peter Jones",
//                   "altText": "Visitors watch as droplets ripple through a cave pool.",
//                   "title": "Longfellow's Bathtub",
//                   "id": 3562,
//                   "caption": "A spectacular view from Longfellow's Bathtub, a long cave pool, inside the Big Room.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C82441C-1DD8-B71B-0B0C8B957333EBC2.jpg"
//               },
//               {
//                   "credit": "Photo by Emily Ficker",
//                   "altText": "\"The Chandelier\" is spotlighted in this photo taken inside the Big Room.",
//                   "title": "The Big Room inside the cavern.",
//                   "id": 3563,
//                   "caption": "A scenic view of the Big Room, highlighting \"the Chandelier\" formation clinging to the 250 foot high ceiling.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C824541-1DD8-B71B-0B357AECFFE928B9.jpg"
//               },
//               {
//                   "credit": "Photo by Emily Ficker",
//                   "altText": "Gorgeous formations inside the Big Room of the cavern.",
//                   "title": "Scenic Big Room",
//                   "id": 3565,
//                   "caption": "A grand view of the Big Room, fully decorated with stalagmites and stalactites.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C8247F9-1DD8-B71B-0BDC504867E4C2C3.jpg"
//               },
//               {
//                   "credit": "Photo by Emily Ficker",
//                   "altText": "A hedgehog cactus in bloom in a rocky garden.",
//                   "title": "Life Among Rocks",
//                   "id": 3567,
//                   "caption": "Amid the arid rocky environment, a hedgehog cactus blooms in the spring.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C824AC3-1DD8-B71B-0B2003C036A23D01.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "Two Jr. Rangers earn their badges.",
//                   "title": "New Jr. Rangers",
//                   "id": 3568,
//                   "caption": "Ranger Chris Bramblett kneeling with two new Jr. Rangers, after the children were awarded their badges.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C824C3A-1DD8-B71B-0B1B41EC0D06A380.jpg"
//               }
//           ],
//           "designation": "National Park",
//           "parkCode": "cave",
//           "id": "6FDE39B1-AB4A-4C9A-A5CD-4AF67601CD78",
//           "fullName": "Carlsbad Caverns National Park"
//       },
//       {
//           "states": "SC",
//           "directionsInfo": "From Interstate 77, Exit 5\nAt Exit 5 turn onto SC Hwy 48 East/Bluff Road. Following the brown and white \"Congaree National Park\" directional signs, travel approximately 8 miles on and then take a slight right onto Old Bluff Road. Follow Old Bluff Road for 4.5 miles to the park entrance sign, which will be on the right. Proceed one mile to the Harry Hampton Visitor Center. Parking lots will be on the right.",
//           "directionsUrl": "http://www.nps.gov/cong/planyourvisit/directions.htm",
//           "url": "https://www.nps.gov/cong/index.htm",
//           "weatherInfo": "Check the forecast before getting on the road. Conditions can change rapidly within the park. Flooding can happen with little or no warning, so make sure to check water levels for Cedar Creek and the Congaree River.",
//           "name": "Congaree",
//           "latLong": "lat:33.79187523, long:-80.74867805",
//           "description": "Astonishing biodiversity exists in Congaree National Park, the largest intact expanse of old growth bottomland hardwood forest remaining in the southeastern United States. Waters from the Congaree and Wateree Rivers sweep through the floodplain, carrying nutrients and sediments that nourish and rejuvenate this ecosystem and support the growth of national and state champion trees.",
//           "images": [
//               {
//                   "credit": "NPS",
//                   "altText": "View of the Congaree River during the Fall",
//                   "title": "Congaree River",
//                   "id": 4274,
//                   "caption": "View of the Congaree River during the Fall",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C862C60-1DD8-B71B-0BB65F7B652BA840.jpg"
//               }
//           ],
//           "designation": "National Park",
//           "parkCode": "cong",
//           "id": "EEBA7225-7FF5-4B62-B60C-6BBC66351A4E",
//           "fullName": "Congaree National Park"
//       },
//       {
//           "states": "DC",
//           "directionsInfo": "Parking\nBecause of limited parking availability, public transportation is recommended. Street parking is available on Constitution Ave. during posted hours.\n\nBicycle\nSidewalks and paved paths are open to bicycles in the park. Please walk your bicycle across the footbridge to Signers Island.\n\nPublic Transportation\nConstitution Gardens is approximately 1 mile from three Metro stops: Foggy Bottom, Farragut West",
//           "directionsUrl": "http://www.nps.gov/coga/planyourvisit/directions.htm",
//           "url": "https://www.nps.gov/coga/index.htm",
//           "weatherInfo": "Washington DC gets to see all four seasons. Humidity will make the temps feel hotter in summer and colder in winter.\n\nSpring (March - May) Temp: Average high is 65.5 degrees with a low of 46.5 degrees\n\nSummer (June - August) Temp: Average high is 86 degrees with a low of 68.5 degrees\n\nFall (September - November) Temp: Average high is 68 degrees with a low of 51.5 degrees\n\nWinter (December - February) Temp: Average high is 45 degrees with a low of 30 degrees\n\n(Source: www.usclimatedata.com)",
//           "name": "Constitution Gardens",
//           "latLong": "lat:38.8909354, long:-77.04409306",
//           "description": "Officially established in 1965, National Mall and Memorial Parks actually protects some of the older parkland in the National Park System. Areas within this premier park provide visitors with ample opportunities to commemorate presidential legacies; honor the courage and sacrifice of war veterans; and celebrate the United States commitment to freedom and equality.",
//           "images": [
//               {
//                   "credit": "NPS Photo/Brian Hall",
//                   "altText": "Shot of the Garden Pond with the Washington Monument in the background",
//                   "title": "Constitution Garden",
//                   "id": 3393,
//                   "caption": "A quiet spot in the midst of the Nations Capital",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C815721-1DD8-B71B-0B6B84757C7F343E.jpg"
//               }
//           ],
//           "designation": "",
//           "parkCode": "coga",
//           "id": "B2F2941A-1BC1-42ED-B02F-541EBC80AEE4",
//           "fullName": "Constitution Gardens"
//       },
//       {
//           "states": "OR",
//           "directionsInfo": "Much of the year, the park's North Entrance is closed to cars. The North Entrance Road closes for the season on November 1 (or earlier if there is significant snowfall) and tends to open in early June.  The park’s South Entrance is open year round. Winter travelers from Roseburg will need to take Route 138 east to Route 230 south to Route 62 east to the park's west entrance. Winter travels from Bend will take Route 97 south to Route 62 north and west to the park's south entrance.",
//           "directionsUrl": "http://www.nps.gov/crla/planyourvisit/directions.htm",
//           "url": "https://www.nps.gov/crla/index.htm",
//           "weatherInfo": "October through June Crater Lake is snow covered. Snowfall averages 533 inches (1,350 cm) annually, and by early spring, it is typical to have ten to fifteen feet (4 meters) of snow on the ground. \n\nJuly, August, and September are drier and warmer. A typical daytime high temperature during these three months is around 67°F (19°C), but can range from 40°F to 80°F or more (4°C to 27°C). Temperatures cool off rapidly in the evening, with a typical nighttime low around 40°F (4°C).",
//           "name": "Crater Lake",
//           "latLong": "lat:42.94065854, long:-122.1338414",
//           "description": "Crater Lake inspires awe. Native Americans witnessed its formation 7,700 years ago, when a violent eruption triggered the collapse of a tall peak. Scientists marvel at its purity: fed by rain and snow, it’s the deepest lake in the USA and perhaps the most pristine on earth. Artists, photographers, and sightseers gaze in wonder at its blue water and stunning setting atop the Cascade Mountain Range.",
//           "images": [
//               {
//                   "credit": "NPS Photo",
//                   "altText": "A view of Crater Lake and Wizard Island",
//                   "title": "Wizard Island",
//                   "id": 458,
//                   "caption": "Looking at Crater Lake and Wizard Island from Discovery Point",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7B227E-1DD8-B71B-0BEECDD24771C381.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "a view of Phantom Ship and Chaski Bay",
//                   "title": "Chaski Bay",
//                   "id": 459,
//                   "caption": "A view from Garfield Peak along the rim of Crater Lake",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7B23C5-1DD8-B71B-0B4F2400855714FA.jpg"
//               },
//               {
//                   "credit": "NPS Photot",
//                   "altText": "a view of Crater Lake from the lakeshore",
//                   "title": "Crater Lake",
//                   "id": 460,
//                   "caption": "A view across Crater Lake from the lakeshore",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7B2524-1DD8-B71B-0B84C60FF964D102.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "Crater Lake as seen from the summit of Mt. Scott",
//                   "title": "Crater Lake from Mount Scott",
//                   "id": 461,
//                   "caption": "A view of the caldera from Mt. Scott, the highest point in Crater Lake National Park",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7B26D3-1DD8-B71B-0B939039D597B9A3.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "water flowing over Vidae Falls",
//                   "title": "Vidae Falls",
//                   "id": 462,
//                   "caption": "Water flowing over Vidae Falls",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7B28BD-1DD8-B71B-0B3EA88108473DEA.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "wildflowers on Wizard Island",
//                   "title": "Wildflowers on Wizard Island",
//                   "id": 463,
//                   "caption": "Wildflowers along the Wizard Island Summit Trail",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7B2A16-1DD8-B71B-0B181596A537FAE3.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "A view of Crater Lake in the winter",
//                   "title": "Crater Lake in Winter",
//                   "id": 464,
//                   "caption": "A view of Crater Lake in the winter",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7B2B97-1DD8-B71B-0B8A0028F7FBEC27.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "Clouds in the Crater Lake Caldera",
//                   "title": "Clouds in the Caldera",
//                   "id": 465,
//                   "caption": "Clouds in the Crater Lake Caldera",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7B2D3B-1DD8-B71B-0B39E67A3DC57E94.jpg"
//               }
//           ],
//           "designation": "National Park",
//           "parkCode": "crla",
//           "id": "7DC1050A-0DDE-4EF9-B777-3C9349BCC4DE",
//           "fullName": "Crater Lake National Park"
//       },
//       {
//           "states": "OH",
//           "directionsInfo": "Plane\nCleveland Hopkins International Airport and Akron-Canton Regional Airport offer many daily flights to the area. Car rentals are available at both airports.\n\nBus & Train\nBus stations are located in downtown Cleveland and Akron. The Amtrak station is in downtown Cleveland.\n\nCar\nThe park is easily accessible by car from all directions. A good place to start your visit is at Boston Store Visitor Center located at 1550 Boston Mills Road, Peninsula, Ohio 44264. (81° 33.512' W) (41° 15.803' N).",
//           "directionsUrl": "http://www.nps.gov/cuva/planyourvisit/directions.htm",
//           "url": "https://www.nps.gov/cuva/index.htm",
//           "weatherInfo": "Spring's rain and warming temperatures bring new leaves on trees, blooming wildflowers, and visitors anxious get out on the trail. \n\nSummer temperatures range from 49 to 95 degrees F and can be humid. Dressing in layers is advisable. \n\nFall temperatures can range from low 70s during the day to freezing during the night. Fall foliage often peaks in mid-October.\n\nWinter weather conditions can rapidly change, due to the lake effect snow from Lake Erie. Temperatures vary from mid-30s to below zero.",
//           "name": "Cuyahoga Valley",
//           "latLong": "lat:41.26093905, long:-81.57116722",
//           "description": "Though a short distance from the urban areas of Cleveland and Akron, Cuyahoga Valley National Park seems worlds away. The park is a refuge for native plants and wildlife, and provides routes of discovery for visitors. The winding Cuyahoga River gives way to deep forests, rolling hills, and open farmlands. Walk or ride the Towpath Trail to follow the historic route of the Ohio & Erie Canal.",
//           "images": [
//               {
//                   "credit": "Photo by Ted Toth",
//                   "altText": "Scenic train as it pulls into Peninsula Depot.",
//                   "title": "Cuyahoga Valley Scenic Railroad in Peninsula",
//                   "id": 3423,
//                   "caption": "Many park visitors ride the scenic excursion trail through the valley or take advantage of the Bike Aboard option to ride one way with their bike.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/50001FF6-1DD8-B71B-0BECA954B0F991BF.jpg"
//               },
//               {
//                   "credit": "Photo by Tom Jones",
//                   "altText": "A ray of sunshine streaming through the rock formation along the Ledges Trail.",
//                   "title": "Along the Ledges Trail",
//                   "id": 3424,
//                   "caption": "One of Cuyahoga Valley's most popular trails, the Ledges Trail proved glimpses of great color and rock formations throughout the year.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C81841A-1DD8-B71B-0B1A447676517C5B.jpg"
//               },
//               {
//                   "credit": "Photo by Tom Jones",
//                   "altText": "A misty sunset over a lone goose at the Beaver Marsh",
//                   "title": "Sunset at the Beaver Marsh",
//                   "id": 3425,
//                   "caption": "Anytime of day or night there is some wildlife at the Beaver Marsh to capture your attention.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/4FD6A6BA-1DD8-B71B-0B5B3D9F4BE50EEF.jpg"
//               },
//               {
//                   "credit": "Photo by Tom Jones",
//                   "altText": "Brandywine Falls the parks 60 ft waterfall.",
//                   "title": "Brandywine Falls",
//                   "id": 11077,
//                   "caption": "Brandywine Falls is Among the Most Popular Attractions in Cuyahoga Valley National Park",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/4FE11F5B-1DD8-B71B-0BBC14532CF8C3B3.jpg"
//               }
//           ],
//           "designation": "National Park",
//           "parkCode": "cuva",
//           "id": "F4D44F29-3F67-498F-B05B-0783473D2708",
//           "fullName": "Cuyahoga Valley National Park"
//       },
//       {
//           "states": "FL",
//           "directionsInfo": "Dry Tortugas National Park is one of the most remote parks in the National Park System. Located approximately 70 miles west of Key West it is accessible only by a daily concession ferry, private boats, charter boats, or seaplane.",
//           "directionsUrl": "http://www.nps.gov/drto/planyourvisit/directions.htm",
//           "url": "https://www.nps.gov/drto/index.htm",
//           "weatherInfo": "The climate in the Dry Tortugas is subtropical, which basically means that it has warm and tropical weather in the range of 60°F to 90°F. The two main seasons are the winter stormy season from December through March which is windier and sees rougher seas, and the summertime tropical storm season from June through November where there is a higher chance of isolated storms. During the summers it is hot and humid. During the winter the temperature is milder and drier.",
//           "name": "Dry Tortugas",
//           "latLong": "lat:24.64884965, long:-82.87176297",
//           "description": "Almost 70 miles (113 km) west of Key West lies the remote Dry Tortugas National Park. This 100-square mile park is mostly open water with seven small islands.  Accessible only by boat or seaplane, the park is known the world over as the home of magnificent Fort Jefferson, picturesque blue waters, superlative coral reefs and marine life, and the vast assortment of bird life that frequents the area.",
//           "images": [
//               {
//                   "credit": "NPS Photo / Maria Belen Farias",
//                   "altText": "Park visitors enjoy a sunset on the moat wall.",
//                   "title": "Sunset at Fort Jefferson",
//                   "id": 3341,
//                   "caption": "Sunsets at the Dry Tortugas are breathtaking. Visitors who choose to camp over night can view the sun set at Fort Jefferson.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C80FF02-1DD8-B71B-0B39AC51BF7B2FA2.jpg"
//               },
//               {
//                   "credit": "NPS Photo / Maria Belen Farias",
//                   "altText": "A view of Fort Jefferson from the moat all.",
//                   "title": "Fort Jefferson",
//                   "id": 3342,
//                   "caption": "ort Jefferson is a massive but unfinished coastal fortress. It is the largest masonry structure in the Americas, and is composed of over 16 million bricks.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C810049-1DD8-B71B-0B0040641619D4A6.jpg"
//               },
//               {
//                   "credit": "NPS Photo / Maria Belen Farias",
//                   "altText": "A boat passes in front of Loggerhead Key during sunset.",
//                   "title": "Loggerhead Key",
//                   "id": 3343,
//                   "caption": "The largest island in the Dry Tortugas, Loggerhead Key is a site of shipwrecks, a significant lighthouse installation, and where the historic Carnegie Laboratory for Marine Ecology once stood. Named for its abundance of loggerhead sea turtles, Loggerhead",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C810258-1DD8-B71B-0BE07AC43C736990.jpg"
//               },
//               {
//                   "credit": "NPS Photo / Maria Belen Farias",
//                   "altText": "A view inside Fort Jefferson.",
//                   "title": "Inside Fort Jefferson",
//                   "id": 3344,
//                   "caption": "Garden Key is the second largest island in the Dry Tortugas, about 14 acres in size, and has had the most human impact. Located on Garden Key is historic Fort Jefferson, one of the nation’s largest 19th century forts and a central cultural feature of Dry",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C8103D0-1DD8-B71B-0B6DB5CF9A4AC58F.jpg"
//               },
//               {
//                   "credit": "NPS Photo / Brett Seymour",
//                   "altText": "A few of the stars at night with a view of Fort Jefferson.",
//                   "title": "Night sky at the Dry Tortugas",
//                   "id": 3345,
//                   "caption": "The Dry Tortugas is so remote that night sky viewing is possible.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C81050F-1DD8-B71B-0B45EDC68B621860.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "Two divers dive the Windjammer Wreck",
//                   "title": "Diving at the Dry Tortugas",
//                   "id": 3346,
//                   "caption": "The Dry Tortugas has over 300 sunken ships. One of the most accessible is the Winjammer Wreck which can be dove or snorkeled.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C810626-1DD8-B71B-0B1DFF7BCF9A0682.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "An aerial view of the Dry Tortugas",
//                   "title": "Aerial view of the Dry Tortugas",
//                   "id": 3347,
//                   "caption": "The Dry Tortugas is made up of seven islands.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C810722-1DD8-B71B-0BAD4B445F0C3D8C.jpg"
//               }
//           ],
//           "designation": "National Park",
//           "parkCode": "drto",
//           "id": "167A05D1-5793-49E0-89FE-0A1DDFA9A7F4",
//           "fullName": "Dry Tortugas National Park"
//       },
//       {
//           "states": "FL",
//           "directionsInfo": "Directions to Ernest Coe Visitor Center\n40001 State Road 9336, Homestead, FL 33034\n\nVisitors coming from the Miami area and points north should take the Florida Turnpike (Route 821) south until it ends merging with U.S. 1 at Florida City. Turn right at the first traffic light onto Palm Drive (State Road 9336/SW 344th St.) and follow the signs to the park.\n\nVisitors driving north from the Florida Keys should turn left on Palm Drive in Florida City and follow the signs to the park.",
//           "directionsUrl": "http://www.nps.gov/ever/planyourvisit/directions.htm",
//           "url": "https://www.nps.gov/ever/index.htm",
//           "weatherInfo": "The climate in Florida is known to be mild and sunny.The average annual temperatures for South Florida and the Keys range from 74° to 77°F (23° to 25°C). There are two seasons at the Everglades National Park: the wet season and the dry season. The wet season runs from Mid-May to November and the dry season runs from December to mid-May.",
//           "name": "Everglades",
//           "latLong": "lat:25.37294225, long:-80.88200301",
//           "description": "Everglades National Park protects an unparalleled landscape that provides important habitat for numerous rare and endangered species like the manatee,  American crocodile, and the elusive Florida panther.\n\nAn international treasure as well -  a World Heritage Site, International Biosphere Reserve, a Wetland of International Importance, and a specially protected area under the Cartagena Treaty.",
//           "images": [
//               {
//                   "credit": "NPS Photo",
//                   "altText": "Two canoes at Nine Mile Pond during sunset.",
//                   "title": "Nine Mile Pond",
//                   "id": 4093,
//                   "caption": "A meeting ground of marsh and mangrove environments. You may see alligators, wading birds, turtles, and fish.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C854681-1DD8-B71B-0BA4F6D9379336DF.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "An American Alligator high walks the Anhinga Trail.",
//                   "title": "American Alligator",
//                   "id": 4095,
//                   "caption": "An American Alligator high walks the Anhinga Trail.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C8547ED-1DD8-B71B-0B596F29F0A9A60B.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "Two visitors bike along the road in Shark Valley.",
//                   "title": "Shark Valley Tram and Bicycle Road",
//                   "id": 4216,
//                   "caption": "Biking is a great way to experience the quiet beauty of the Everglades.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C85E60F-1DD8-B71B-0BAB4F7583E96025.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "An aerial view of the landscape transition from Sawgrass to Florida Bay.",
//                   "title": "Transition from Sawgrass to Florida Bay",
//                   "id": 4217,
//                   "caption": "An aerial view of the landscape transition from Sawgrass to Florida Bay.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C85E70B-1DD8-B71B-0B7C75649CCDB907.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "Three tents are put up along the Long Pine Key campsite.",
//                   "title": "Camping at Long Pine Key",
//                   "id": 4229,
//                   "caption": "Long Pine Key Campground is open seasonally from November through May. It is located seven miles (11 km) from the main entrance, just off the main road.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C85F532-1DD8-B71B-0BFC5BB51D8AB675.jpg"
//               }
//           ],
//           "designation": "National Park",
//           "parkCode": "ever",
//           "id": "5EA02193-276A-4037-B7DB-5765A56935FD",
//           "fullName": "Everglades National Park"
//       },
//       {
//           "states": "OH",
//           "directionsInfo": "The First Ladies National Historic Site is located in downtown Canton, Ohio. Free parking is available behind the Saxton House or at our gated lot on the corner of Market Avenue South and 3rd Street SW (entrance from Market Avenue South).",
//           "directionsUrl": "http://www.nps.gov/fila/planyourvisit/directions.htm",
//           "url": "https://www.nps.gov/fila/index.htm",
//           "weatherInfo": "The weather at First Ladies National Historic Site is typical of Northeastern Ohio: four distinct seasons. \n\nSpring's rain and warming temperatures bring new leaves on trees and blooming wildflowers.\n\nSummer temperatures range from 49 to 95 degrees F and can be humid. \n\nFall temperatures can range from low 70s during the day to freezing during the night. Fallcolor peaks mid-October.\n\nWinter weather conditions can rapidly change. Temperatures vary from mid-30s to below zero.",
//           "name": "First Ladies",
//           "latLong": "lat:40.79689857, long:-81.37579869",
//           "description": "Two properties, the home of First Lady Ida Saxton McKinley and the seven story 1895 City Bank Building, are preserved at this site, which honors the lives and accomplishment of our nation's First Ladies. The site is managed by the National Park Service and operated by the National First Ladies Library.",
//           "images": [
//               {
//                   "credit": "NPS Photo",
//                   "altText": "a front view of the Ida Saxton McKinley House",
//                   "title": "First Ladies National Historic Site",
//                   "id": 3569,
//                   "caption": "This was the longtime residence of William and Ida McKinley.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C824DCE-1DD8-B71B-0B14D80DEE050385.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "Exhibit photographs of William and Ida McKinley",
//                   "title": "McKinley Exhibits",
//                   "id": 3570,
//                   "caption": "",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C824F57-1DD8-B71B-0B04DD274784ABAD.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "A piano in the Saxton McKinley Home",
//                   "title": "Saxton McKinley House Piano",
//                   "id": 3571,
//                   "caption": "Ida Saxton's original piano is just one of many items belonging to President McKinley and First Lady Ida McKinley.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C8250B3-1DD8-B71B-0BC1186047C44DD7.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "A view of the City National Bank Building which was donated to the First Ladies Library.",
//                   "title": "National First Ladies' Library Education and Research Center",
//                   "id": 3572,
//                   "caption": "There is a 91-seat Victorian Theatre on the lower level, where films and documentaries on the first ladies are shown and author lectures and live presentations are held.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C8251FF-1DD8-B71B-0B27B4560CEBA98E.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "Close up view of home entrance.",
//                   "title": "Saxton McKinley Home",
//                   "id": 3573,
//                   "caption": "The Saxton McKinley Home is significant as the only residence with direct historical ties to President William McKinley remaining in his hometown of Canton.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C82537E-1DD8-B71B-0B629A860705ABF0.jpg"
//               }
//           ],
//           "designation": "National Historic Site",
//           "parkCode": "fila",
//           "id": "35CB040E-765C-47D0-A594-05943E64EF3E",
//           "fullName": "First Ladies National Historic Site"
//       },
//       {
//           "states": "DC",
//           "directionsInfo": "Ford's Theatre National Historic Site is located on 10th Street between E and F streets. The site is within walking distance of the Metro stops at Metro Center and Gallery Place. Parking garages and metered street parking are located nearby.",
//           "directionsUrl": "http://www.nps.gov/foth/planyourvisit/directions.htm",
//           "url": "https://www.nps.gov/foth/index.htm",
//           "weatherInfo": "Washington DC gets to see all four seasons. Humidity will make the temps feel hotter in summer and colder in winter.\n\nSpring (March - May) Temp: Average high is 65.5 degrees with a low of 46.5 degrees\n\nSummer (June - August) Temp: Average high is 86 degrees with a low of 68.5 degrees\n\nFall (September - November) Temp: Average high is 68 degrees with a low of 51.5 degrees\n\nWinter (December - February) Temp: Average high is 45 degrees with a low of 30 degrees\n\n(Source: www.usclimatedata.com)",
//           "name": "Ford's Theatre",
//           "latLong": "lat:38.89668819, long:-77.02577944",
//           "description": "Explore Ford's Theatre NHS, discover Abraham Lincoln's life in Washington, D.C., the struggle for a united country, and the motivation behind Lincoln's assassination. The National Park Service and the Ford's Theatre Society present a variety of programs year round.",
//           "images": [
//               {
//                   "credit": "NPS Photo",
//                   "altText": "Picture of the front of Ford's Theatre",
//                   "title": "Ford's Theatre Front",
//                   "id": 3390,
//                   "caption": "Where a nations destiny was met.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C815286-1DD8-B71B-0BF2AD2960AE4AF6.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "Presidential Box at Ford's Theatre",
//                   "title": "Ford's Theatre Box",
//                   "id": 3391,
//                   "caption": "Where President Lincoln was shot",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C815409-1DD8-B71B-0BAC8D32EE392B5B.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "Front of Peterson House",
//                   "title": "Peterson House",
//                   "id": 3392,
//                   "caption": "Place where Lincoln died.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C8155AE-1DD8-B71B-0B79EA81C5585F29.jpg"
//               }
//           ],
//           "designation": "",
//           "parkCode": "foth",
//           "id": "C1D82E29-1291-415B-9834-5A0480D2732C",
//           "fullName": "Ford's Theatre"
//       },
//       {
//           "states": "GA",
//           "directionsInfo": "South on I 95 to U.S. 17:\nExit 38 and Left onto Spur 25. Follow Spur 25 until U.S. 17. Take a right on U.S. 17 (south).\n\nNorth on I 95 to U.S. 17:\nExit 29 and Right onto U.S. 17.\n\nFrom US 17:\nTake Causeway to St. Simons Island. Take first left onto Sea Island Rd. Go 1.5 miles to third traffic light, and Left onto Frederica Road. Follow Frederica Road for two miles (take second right off roundabout). The park entrance 300 yards past Christ Church.",
//           "directionsUrl": "http://www.nps.gov/fofr/planyourvisit/directions.htm",
//           "url": "https://www.nps.gov/fofr/index.htm",
//           "weatherInfo": "The site enjoys mild climate from fall through early summer, followed by hot, humid summers.",
//           "name": "Fort Frederica",
//           "latLong": "lat:31.2214699, long:-81.39452014",
//           "description": "Georgia's fate was decided in 1742 when Spanish and British forces clashed on St. Simons Island. Fort Frederica's troops defeated the Spanish, ensuring Georgia's future as a British colony. Today, the archeological remnants of Frederica are protected by the National Park Service.",
//           "images": [
//               {
//                   "credit": "NPS photo",
//                   "altText": "Ruin of Soldier Barracks at Fort Frederica NM",
//                   "title": "Ruin of Soldier Barracks at Fort Frederica NM",
//                   "id": 1889,
//                   "caption": "The Barracks ruin is one of the few above ground structures at Fort Frederica",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7DD350-1DD8-B71B-0BF0B4C77628ED80.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "Artist rendering of Downtown Frederica Town",
//                   "title": "Artist rendering of Downtown Frederica Town",
//                   "id": 1890,
//                   "caption": "Artist rendering of Downtown Frederica Town",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7DD4D2-1DD8-B71B-0B2F6AE10061EEDA.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "Artist rendering of Downtown Frederica Town",
//                   "title": "Artist rendering of Downtown Frederica Town",
//                   "id": 1891,
//                   "caption": "Artist rendering of Downtown Frederica Town",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7DD66B-1DD8-B71B-0BB613CFA00C35B7.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "Artifacts found at Frederica",
//                   "title": "Artifacts found at Frederica",
//                   "id": 1892,
//                   "caption": "Artifacts found at Frederica",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7DD81D-1DD8-B71B-0BD41D04DF8DB390.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "Reenactors performing as the original redcoats who served at Frederica",
//                   "title": "Soldiers of the 42nd Regiment of Foote",
//                   "id": 1893,
//                   "caption": "Soldiers of the 42nd Regiment of Foote",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7DDA2F-1DD8-B71B-0B1528D99B1014B0.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "A large grapevine draped among the Live Oaks",
//                   "title": "100 year old grapevine at Frederica",
//                   "id": 1894,
//                   "caption": "100 year old grapevine at Frederica which still produces \"Summer Grapes\"",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7DDC0E-1DD8-B71B-0B2D727C6EF2F489.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "The shadow of the ruin of Fort Frederica highlighted by a sunset along the Frederica River.",
//                   "title": "Fort Frederica at Sunset",
//                   "id": 1895,
//                   "caption": "Nature and History combine in a beautiful setting at Fort Frederica",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7DDE1A-1DD8-B71B-0B341050E0F95288.jpg"
//               },
//               {
//                   "credit": "NPS photo",
//                   "altText": "Brick building of the Visitor Center with Azaleas blossoming in front",
//                   "title": "Fort Frederica's Visitor Center during Azalea Season",
//                   "id": 1896,
//                   "caption": "Fort Frederica's Visitor Center during Azalea Season",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7DE008-1DD8-B71B-0B3801F151DECD83.jpg"
//               }
//           ],
//           "designation": "National Monument",
//           "parkCode": "fofr",
//           "id": "4301F6E9-750B-489D-B8E4-4204165894A1",
//           "fullName": "Fort Frederica National Monument"
//       },
//       {
//           "states": "AK",
//           "directionsInfo": "Gates of the Arctic is a wilderness park, with no roads or trails into the park lands, so visitors must fly or hike into the park. Access begins in Fairbanks, Alaska & there are several small airlines that provide daily flights into the communities of Bettles and Anaktuvuk Pass, and Coldfoot. Most visitors access the park by air taxi or hike in from the Dalton Highway or from the village of Anaktuvuk Pass. River crossings are necessary from both locations.",
//           "directionsUrl": "http://www.nps.gov/gaar/planyourvisit/directions.htm",
//           "url": "https://www.nps.gov/gaar/index.htm",
//           "weatherInfo": "The climate of Gates of the Arctic National Park & Preserve is generally classified as arctic and sub-arctic, with exceptionally cold winters, relatively mild summers, low annual precipitation, and generally high winds. The weather is influenced by many different systems, and can change rapidly.",
//           "name": "Gates Of The Arctic",
//           "latLong": "lat:67.75961636, long:-153.2917758",
//           "description": "This vast landscape does not contain any roads or trails. Visitors discover intact ecosystems where people have lived with the land for thousands of years. Wild rivers meander through glacier-carved valleys, caribou migrate along age-old trails, endless summer light fades into aurora-lit night skies of winter. It remains virtually unchanged except by the forces of nature.",
//           "images": [
//               {
//                   "credit": "NPS Photo",
//                   "altText": "Alpenglow on the granite cliffs of mountains",
//                   "title": "Arrigetch Peaks",
//                   "id": 368,
//                   "caption": "A spring alpenglow brightens the granite walls of the Arrigetch Peaks",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7A89F4-1DD8-B71B-0B52204A2EBF61A4.jpg"
//               },
//               {
//                   "credit": "NPS Photo / Sean Tevebaugh",
//                   "altText": "Aerial view of the Alatna River as it winds through a valley",
//                   "title": "Alatna River",
//                   "id": 369,
//                   "caption": "Aerial view of the Alatna River as it winds through a valley",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7A8B6B-1DD8-B71B-0B8B89FE0C6B6F4F.jpg"
//               },
//               {
//                   "credit": "Photo courtesy of Paxson Woebler",
//                   "altText": "A hiker crosses a stream with mountains in the background",
//                   "title": "Entering Oolah Valley",
//                   "id": 370,
//                   "caption": "A hiker crosses a stream and enters Oolah Valley.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7A8CFC-1DD8-B71B-0BF455202A395DA6.jpg"
//               },
//               {
//                   "credit": "Photo courtesy of Paxson Wobelber",
//                   "altText": "Handful of blueberries",
//                   "title": "Blueberries",
//                   "id": 371,
//                   "caption": "Pausing to pick blueberries can result in a handful of delicious snacks.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7A8E6D-1DD8-B71B-0B34C967D29F5940.jpg"
//               },
//               {
//                   "credit": "Photo courtesy of Paxson Woebler",
//                   "altText": "Two hikers climb up a mountain pass",
//                   "title": "Hikers crossing a mountain pass",
//                   "id": 372,
//                   "caption": "Hikers choose river valleys as corridors when hiking over mountain passes.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7A8FC3-1DD8-B71B-0BB9EF068FF8EFF7.jpg"
//               }
//           ],
//           "designation": "National Park & Preserve",
//           "parkCode": "gaar",
//           "id": "BC195D18-71C8-4A99-BF8E-10BFAB849679",
//           "fullName": "Gates Of The Arctic National Park & Preserve"
//       },
//       {
//           "states": "MO",
//           "directionsInfo": "For directions click on the provided link",
//           "directionsUrl": "http://www.nps.gov/jeff/planyourvisit/directions.htm",
//           "url": "https://www.nps.gov/jeff/index.htm",
//           "weatherInfo": "Normal Daily Mean Temperature (in degrees Fahrenheit)*\n\nJanuary - 29.3\nFebruary - 33.9\nMarch - 45.1\nApril - 56.7\nMay - 66.1\nJune - 75.4\nJuly - 79.8\nAugust - 77.6\nSeptember - 70.2\nOctober - 58.4\nNovember - 46.2\nDecember - 33.9\n\nAverage Percent of Days with Sunshine*\n\nJanuary - 50%\nFebruary - 52%\nMarch - 54%\nApril - 56%\nMay - 59%\nJune - 66%\nJuly - 68%\nAugust - 65%\nSeptember - 63%\nOctober - 60%\nNovember - 46%\nDecember - 53%\n\n*Source: National Oceanic and Atmospheric Administration",
//           "name": "Gateway Arch",
//           "latLong": "lat:38.62328806, long:-90.18039557",
//           "description": "The Gateway Arch reflects St. Louis' role in the Westward Expansion of the United States during the nineteenth century. The park is a memorial to Thomas Jefferson's role in opening the West, to the pioneers who helped shape its history, and to Dred Scott who sued for his freedom in the Old Courthouse.",
//           "images": [
//               {
//                   "credit": "NPS Photo/Sue Ford",
//                   "altText": "Gateway Arch at Sunrise",
//                   "title": "Gateway Arch at Sunrise",
//                   "id": 1563,
//                   "caption": "The sunrise coming up behind the Gateway Arch.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7BD9B5-1DD8-B71B-0B598216CE4E46D0.jpg"
//               },
//               {
//                   "credit": "NPS Photo/Sue Ford",
//                   "altText": "Old Courthouse and Gateway Arch",
//                   "title": "Old Courthouse and Gateway Arch",
//                   "id": 1564,
//                   "caption": "Old Courthouse and Gateway Arch",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7BDB70-1DD8-B71B-0BA1BE2E2619D318.jpg"
//               },
//               {
//                   "credit": "NPS Photo/Sue Ford",
//                   "altText": "Gateway Arch",
//                   "title": "Gateway Arch",
//                   "id": 1569,
//                   "caption": "Over a million people visit the Gateway Arch each year.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7BE38B-1DD8-B71B-0BBBE77BE3A2180A.jpg"
//               },
//               {
//                   "credit": "NPS Photo/Sue Ford",
//                   "altText": "Arch and clouds",
//                   "title": "Reaching for the Clouds",
//                   "id": 1570,
//                   "caption": "Arch reaching toward the clouds.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7BE538-1DD8-B71B-0BFF11B2DBCF6E6E.jpg"
//               },
//               {
//                   "credit": "NPS Photo/Sue Ford",
//                   "altText": "Construction on the Arch Grounds",
//                   "title": "Construction on the Arch Grounds",
//                   "id": 1571,
//                   "caption": "Construction on the Arch Grounds as seen from the Riverboats.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7BE6F8-1DD8-B71B-0B5AD310D2216189.jpg"
//               }
//           ],
//           "designation": "National Park",
//           "parkCode": "jeff",
//           "id": "BD588493-EC77-4B97-B73E-3BA444864DC5",
//           "fullName": "Gateway Arch National Park"
//       },
//       {
//           "states": "AK",
//           "directionsInfo": "Glacier Bay National Park and Preserve lies west of Juneau, Alaska, and can only be reached by plane or boat. The only road in the area merely connects the small town of Gustavus and its airfield to park headquarters at Bartlett Cove (10 miles). Alaska Airlines provides daily jet service from Juneau to Gustavus  in the summer months. Year-round scheduled air service is also provided by a variety of small air taxis and charters. The Alaska Marine Highway ferries also provide regular service from Juneau.",
//           "directionsUrl": "http://www.nps.gov/glba/planyourvisit/directions.htm",
//           "url": "https://www.nps.gov/glba/index.htm",
//           "weatherInfo": "Summer temperatures average 50° to 60° F (10° to 15° C). Rain is the norm in lush southeast Alaska. It is best to be prepared to enjoy the park in any kind of weather, especially rain. Suggested clothing includes waterproof boots, rain gear, a hat, gloves, wool or pile layers or a warm coat. Good rain gear is essential here. April, May and June are usually the driest months of the year. September and October tend to be the wettest.",
//           "name": "Glacier Bay",
//           "latLong": "lat:58.80086718, long:-136.8407579",
//           "description": "Covering 3.3 million acres of rugged mountains, dynamic glaciers, temperate rainforest, wild coastlines and deep sheltered fjords, Glacier Bay National Park is a highlight of Alaska's Inside Passage and part of a 25-million acre World Heritage Site—one of the world’s largest international protected areas. From sea to summit, Glacier Bay offers limitless opportunities for adventure and inspiration.",
//           "images": [
//               {
//                   "credit": "NPS Photo",
//                   "altText": "Icebergs, calved from tidewater glaciers are a common sight in Glacier Bay National Park.",
//                   "title": "Iceberg on the shore",
//                   "id": 71,
//                   "caption": "Icebergs, calved from tidewater glaciers are a common sight in Glacier Bay National Park.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C790BBF-1DD8-B71B-0B0AE92D0B9C24EB.jpg"
//               },
//               {
//                   "credit": "NPS Photo / B. Whitehead",
//                   "altText": "Pan ice in Tarr Inlet",
//                   "title": "Pan ice in Tarr Inlet",
//                   "id": 73,
//                   "caption": "Glacier Bay offers a rare glimpse into the Ice Age",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C790D9C-1DD8-B71B-0B4327321DED12AE.jpg"
//               },
//               {
//                   "credit": "NPS Photo / C. Behnke",
//                   "altText": "Beachcombing Brown Bear",
//                   "title": "Beachcombing Brown Bear",
//                   "id": 74,
//                   "caption": "Brown bears frequently forage along the shoreline of Glacier Bay",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C790F92-1DD8-B71B-0BDF3774E82CB555.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "Sheltered waters of Glacier Bay",
//                   "title": "Sheltered waters of Glacier Bay",
//                   "id": 77,
//                   "caption": "Glacier Bay is a paradise for wilderness aficionados.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C79135D-1DD8-B71B-0BDF788A6D50B7A9.jpg"
//               },
//               {
//                   "credit": "NPS / T. VandenBerg",
//                   "altText": "Cruising Glacier Bay",
//                   "title": "Cruising Glacier Bay",
//                   "id": 79,
//                   "caption": "Passengers line the deck to enjoy the icy scene at Margerie Glacier",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C791618-1DD8-B71B-0B113FBF2EC1D614.jpg"
//               },
//               {
//                   "credit": "NPS photo",
//                   "altText": "Camping in the Glacier Bay backcountry",
//                   "title": "Camping in the Glacier Bay backcountry",
//                   "id": 274,
//                   "caption": "Glacier Bay provides endless possibilities for wilderness camping.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7A0EE5-1DD8-B71B-0BADF220CB5F20BE.jpg"
//               }
//           ],
//           "designation": "National Park & Preserve",
//           "parkCode": "glba",
//           "id": "3682DBDE-6746-4979-86CC-2358C5B72661",
//           "fullName": "Glacier Bay National Park & Preserve"
//       },
//       {
//           "states": "MT",
//           "directionsInfo": "Glacier National Park is located in the northwest corner of Montana along the spine of the Rocky Mountains.\nBy Car you can access Glacier via Highway 2, which runs along the southern boundary of the park. You can reach the east side of the park via Highway 89.\n\nThe nearest airports are in Kalispell and Great Falls, Montana",
//           "directionsUrl": "http://www.nps.gov/glac/planyourvisit/directions.htm",
//           "url": "https://www.nps.gov/glac/index.htm",
//           "weatherInfo": "Glacier's weather is highly variable and can be extreme. Expect warm sunny summer days and in the winter the temperatures can fall well below freezing. Glacier's geography, straddling the Continental Divide, sets the stage for clashes of two very different climates. Warm, wet Pacific air moves in from the west, and cold dry Arctic air from the northeast. They meet at the Divide.",
//           "name": "Glacier",
//           "latLong": "lat:48.68414678, long:-113.8009306",
//           "description": "Come and experience Glacier's pristine forests, alpine meadows, rugged mountains, and spectacular lakes. With over 700 miles of trails, Glacier is a hiker's paradise for adventurous visitors seeking wilderness and solitude. Relive the days of old through historic chalets, lodges, and the famous Going-to-the-Sun Road. Explore Glacier National Park and discover what awaits you.",
//           "images": [
//               {
//                   "credit": "NPSPhoto / Tim Rains",
//                   "altText": "View of Logan Pass and the Continental Divide from the summit of Mt. Oberlin",
//                   "title": "Logan Pass from Mt. Oberlin",
//                   "id": 3149,
//                   "caption": "View of Logan Pass and the Continental Divide from the summit of Mt. Oberlin",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7FEF84-1DD8-B71B-0B26F3C536955733.jpg"
//               },
//               {
//                   "credit": "NPS Photo / Jacob W. Frank",
//                   "altText": "View of St. Mary Lake from Wild Goose Island Overlook",
//                   "title": "St. Mary Lake and Wild Goose Island",
//                   "id": 3150,
//                   "caption": "View of St. Mary Lake from Wild Goose Island Overlook",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7FF0EB-1DD8-B71B-0BDB1379DE9714E1.jpg"
//               },
//               {
//                   "credit": "NPS Photo / Bill Hayden",
//                   "altText": "View of the mountains behind Lake McDonald at sunset",
//                   "title": "Lake McDonald at Sunset",
//                   "id": 3151,
//                   "caption": "Sunset on the mountains at the head of Lake McDonald",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7FF2E3-1DD8-B71B-0B923A10BC5E84EE.jpg"
//               },
//               {
//                   "credit": "NPS Photo / Bill Hayden",
//                   "altText": "Bowman Lake",
//                   "title": "Bowman Lake",
//                   "id": 3152,
//                   "caption": "View of Bowman Lake in the northwest corner of the park",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7FF4C4-1DD8-B71B-0BAD950614B93B72.jpg"
//               },
//               {
//                   "credit": "NPS Photo / Jacob W. Frank",
//                   "altText": "Looking down into the lobby of the Lake McDonald Lodge from the balcony",
//                   "title": "Lobby of the Lake McDonald Lodge",
//                   "id": 3153,
//                   "caption": "Lobby of the historic Lake McDonald Lodge",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7FF648-1DD8-B71B-0B074AA63C93947A.jpg"
//               }
//           ],
//           "designation": "National Park",
//           "parkCode": "glac",
//           "id": "2B5178C6-2446-488C-AC31-47E3CEBF7159",
//           "fullName": "Glacier National Park"
//       },
//       {
//           "states": "MD",
//           "directionsInfo": "By Car: Capital Beltway (I-495), Maryland outer loop exit 40 Cabin John Parkway to Clara Barton Parkway; Virginia inner loop exit 41 Clara Barton Parkway East; follow Clara Barton Parkway to MacArthur Boulevard and Glen Echo exit, left onto MacArthur Boulevard, straight across traffic circle at Goldsboro Road, next left onto Oxford Road, end of street, parking lots on the left.\n\nBy Metro: Red Line to Bethesda or Friendship Heights Station, transfer to Montgomery County Ride-On Bus # 29, Glen Echo stop.",
//           "directionsUrl": "http://www.nps.gov/glec/planyourvisit/directions.htm",
//           "url": "https://www.nps.gov/glec/index.htm",
//           "weatherInfo": "Weather for Washington, D.C. and Bethesda, Maryland areas.",
//           "name": "Glen Echo",
//           "latLong": "lat:38.96912315, long:-77.14012206",
//           "description": "Glen Echo Park began in 1891 as a National Chautauqua Assembly \"to promote liberal and practical education.\" By 1911, it transformed into DC's premier amusement park until it closed in 1968. Since 1971, the National Park Service has owned and operated the site and today, with the help of the Glen Echo Park Partnership for Arts and Culture, offers year-round cultural and recreational activities.",
//           "images": [
//               {
//                   "credit": "NPS Photo",
//                   "altText": "people walking around large room during art show",
//                   "title": "Labor Day Art Show in Spanish Ballroom",
//                   "id": 3972,
//                   "caption": "Visitors enjoy the Labor Day Art Show which highlights pieces created by students from the Glen Echo Park art programs.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C848D11-1DD8-B71B-0BC49FD5EE187494.jpg"
//               },
//               {
//                   "credit": "NPS Photo/Bruce Douglas",
//                   "altText": "outdoor scene of open dance pavilion illuminated and evening dance crowd inside.",
//                   "title": "Dancing in the Bumper Car Pavilion",
//                   "id": 3973,
//                   "caption": "Evening Dance in the Bumper Car Pavilion",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C848E7B-1DD8-B71B-0BBAA0366FDA5B58.jpg"
//               },
//               {
//                   "credit": "NPS Photo/Bruce Douglas",
//                   "altText": "groups of families, adults and children strolling in Glen Echo Park near Carousel Building",
//                   "title": "Busy Day outside Carousel",
//                   "id": 3974,
//                   "caption": "Glen Echo Park and the Dentzel Carousel are enjoyed by children and adults.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C848FDE-1DD8-B71B-0BE1393F7AFBC3D4.jpg"
//               },
//               {
//                   "credit": "NPS Photo/Bruce Douglas",
//                   "altText": "people gathered at picnic tables enjoying a lunch in Glen Echo Park",
//                   "title": "Glen Echo Picnic area",
//                   "id": 3975,
//                   "caption": "Glen Echo Park has a large picnic area with many tables, restrooms and a playground.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C84917B-1DD8-B71B-0B9EAFE7DD8C3A13.jpg"
//               },
//               {
//                   "credit": "NPS Photo/Bruce Douglas",
//                   "altText": "three children seated at a picnic table working on a Glen Echo Park Junior Ranger Booklet.",
//                   "title": "Glen Echo Park Junior Rangers working on booklet.",
//                   "id": 3976,
//                   "caption": "Completing the Glen Echo Park Junior Ranger Booklet to earn the Junior Ranger Badge.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C849327-1DD8-B71B-0B64DA209DFC98B9.jpg"
//               }
//           ],
//           "designation": "Park",
//           "parkCode": "glec",
//           "id": "3FBC6D2D-C61B-4399-BC35-1B00C92C406A",
//           "fullName": "Glen Echo Park"
//       },
//       {
//           "states": "AZ",
//           "directionsInfo": "South Rim: Open all year, is located 60 miles north of Williams, Arizona (via route 64 from Interstate 40) and 80 miles northwest of Flagstaff (via route 180). Grand Canyon lies entirely within the state of Arizona.\n\n North Rim: located 30 miles south of Jacob Lake on Highway 67; the actual rim of the canyon is an additional 14 miles south. Jacob Lake, AZ is located in northern Arizona on Highway 89A, not far from the Utah border.",
//           "directionsUrl": "http://www.nps.gov/grca/planyourvisit/directions.htm",
//           "url": "https://www.nps.gov/grca/index.htm",
//           "weatherInfo": "This weather varies with cold winters and mild pleasant summers, moderate humidity, and considerable diurnal temperature changes at the higher elevations, with hot and drier summers at the bottom of the Grand Canyon along with cool damp winters. Summer thunderstorms and winter snowfall adds to the weather variety in this region.",
//           "name": "Grand Canyon",
//           "latLong": "lat:36.17280161, long:-112.6836024",
//           "description": "Unique combinations of geologic color and erosional forms decorate a canyon that is 277 river miles (446km) long, up to 18 miles (29km) wide, and a mile (1.6km) deep. Grand Canyon overwhelms our senses through its immense size.\n\nThe South Rim is open all year\n \nThe North Rim is closed for the winter. It will reopen on May 15, 2019.",
//           "images": [
//               {
//                   "credit": "NPS/M.Quinn",
//                   "altText": "The canyon glows orange as people visit Mather Point, a rock outcropping that juts into Grand Canyon",
//                   "title": "Grand Canyon Mather Point Sunset on the South Rim",
//                   "id": 448,
//                   "caption": "People come from all over the world to view Grand Canyon's sunset",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7B12D1-1DD8-B71B-0BCE0712F9CEA155.jpg"
//               },
//               {
//                   "credit": "NPS/M.Quinn",
//                   "altText": "The Cape Royal viewpoint curves into the distance and closer rock formations jut into the canyon.",
//                   "title": "Grand Canyon National Park: View from Cape Royal on the North Rim",
//                   "id": 449,
//                   "caption": "A popular outdoor site for weddings and receptions, Cape Royal Amphitheater is located 23 miles (37 km) from the North Rim developed area.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7B143E-1DD8-B71B-0BD4A1EF96847292.jpg"
//               },
//               {
//                   "credit": "NPS/M.Quinn",
//                   "altText": "The Desert View Watchtower looms 70 feet into the air over a vast and dramatic view of the canyon.",
//                   "title": "Grand Canyon National Park: Desert View Watchtower (South Rim)",
//                   "id": 450,
//                   "caption": "The Watchtower is located at Desert View, the eastern-most developed area on the South Rim of Grand Canyon National Park.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7B15A4-1DD8-B71B-0BFADECB506765CC.jpg"
//               },
//               {
//                   "credit": "NPS/M.Quinn",
//                   "altText": "Tall canyon walls frame the wide Colorado river weaving back and forth.",
//                   "title": "Looking down the Colorado River from Nankoweap at river mile 53",
//                   "id": 451,
//                   "caption": "A view down the Colorado river from Nankoweap in Marble canyon.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7B1720-1DD8-B71B-0B74DCF6F887A960.jpg"
//               },
//               {
//                   "credit": "NPS/M.Quinn",
//                   "altText": "Buildings overlook the vastness of Grand Canyon.",
//                   "title": "Aerial View of Grand Canyon Village",
//                   "id": 1572,
//                   "caption": "Aerial view of the El Tovar Hotel, Hopi House, Colter Hall and Kachina Lodge. Passenger train at the station, in the Historic District on the South Rim of Grand Canyon National Park",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7BE916-1DD8-B71B-0BB0D4D294FCD842.jpg"
//               }
//           ],
//           "designation": "National Park",
//           "parkCode": "grca",
//           "id": "B7FF43E5-3A95-4C8E-8DBE-72D8608D6588",
//           "fullName": "Grand Canyon National Park"
//       },
//       {
//           "states": "NV",
//           "directionsInfo": "From the East or West: From U.S. Highway 6 & 50, turn south on Nevada State Highway 487 and travel 5 miles to Baker, NV. In Baker turn west on Highway 488 and travel 5 miles to the park. From the South (Utah): Travel north on Utah State Highway 21 through Milford, UT and Garrison, UT, Highway 487. Turn west on Highway 488 in Baker and travel 5 miles to the park. From the South (Nevada): Travel north on U.S. Highway 93. No public transportation is available to, or in, Great Basin National Park.",
//           "directionsUrl": "http://home.nps.gov/grba/planyourvisit/directions.htm",
//           "url": "https://www.nps.gov/grba/index.htm",
//           "weatherInfo": "There is almost an 8,000 ft (2,400 m) difference in elevation between Wheeler Peak and the valley floor. Weather conditions in the park vary with elevation. In late spring and early summer, days in the valley may be hot, yet the snow pack may not have melted in the higher elevations. The Great Basin is a desert, with low relative humidity and sharp drops in temperature at night. In the summer, fierce afternoon thunderstorms are common. It can snow any time of the year at high elevations.",
//           "name": "Great Basin",
//           "latLong": "lat:38.94617378, long:-114.2579782",
//           "description": "From the 13,000-foot summit of Wheeler Peak, to the sage-covered foothills, Great Basin National Park is a place to sample the stunning diversity of the larger Great Basin region. Come and partake of the solitude of the wilderness, walk among ancient bristlecone pines, bask in the darkest of night skies, and explore mysterious subterranean passages. There's a whole lot more than just desert here!",
//           "images": [
//               {
//                   "credit": "NPS Photo",
//                   "altText": "Viewers gaze at stars and planets through telescope",
//                   "title": "Star Gazers",
//                   "id": 4441,
//                   "caption": "Star Gazers view the Galaxy.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C876E30-1DD8-B71B-0B6A6CDF68B4FA89.jpg"
//               }
//           ],
//           "designation": "National Park",
//           "parkCode": "grba",
//           "id": "4C1A549B-080F-4522-9CA7-67BB5A0845CA",
//           "fullName": "Great Basin National Park"
//       },
//       {
//           "states": "NJ",
//           "directionsInfo": "Estell Manor Park, where visitors can see the Great Egg Harbor National Scenic and Recreational River, is located 3.5 miles South of Mays Landing, New Jersey, off of Route 50. It is approximately 17 miles west of Atlantic City. There is a stamper for Passport Stamp Books at the Fox Nature Center, and a stamp can be obtained at the mailing address provided below.",
//           "directionsUrl": "http://www.aclink.org/PARKS/mainpages/estell.asp",
//           "url": "https://www.nps.gov/greg/index.htm",
//           "weatherInfo": "Temperate, with a moderating influence of the Atlantic Ocean.",
//           "name": "Great Egg Harbor River",
//           "latLong": "lat:39.30421499, long:-74.64969521",
//           "description": "The River gradually widens as it picks up the waters of 17 tributaries on its way to Great Egg Harbor and the Atlantic Ocean. Established by Congress in 1992, nearly all of this 129-mile river system rests within the Pinelands National Reserve. This National Park Service unit is unusual in that local jurisdictions continue to administer the lands.",
//           "images": [
//               {
//                   "credit": "Tim Kiser",
//                   "altText": "Still river in the winter with leafless trees on either side",
//                   "title": "Great Egg Harbor River",
//                   "id": 4778,
//                   "caption": "Great Egg Harbor River downstream from Mill Street (New Jersey Route 559) in Mays Landing, New Jersey",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/69830EAB-1DD8-B71B-0B2995AFD827B8FB.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "Sun setting over the river.",
//                   "title": "Gibson Creek",
//                   "id": 6789,
//                   "caption": "Gibson Creek",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/425BFE7C-1DD8-B71B-0BEAD91965AC7890.jpg"
//               },
//               {
//                   "credit": "Akers",
//                   "altText": "School group examines a fish held by the instructor.",
//                   "title": "Floating Classrooms",
//                   "id": 6790,
//                   "caption": "Students learn about river resources on a floating classroom.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/4264700A-1DD8-B71B-0BE6A35701B10E72.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "Bright white comet in the early night sky reflects over the river.",
//                   "title": "Haley's Comet over the Great Egg Harbor River",
//                   "id": 6791,
//                   "caption": "Haley's Comet over the Great Egg Harbor River",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/4276EC67-1DD8-B71B-0B3D7FCEDB5CFD39.jpg"
//               },
//               {
//                   "credit": "Palmer",
//                   "altText": "Winding river surrounded by grasslands on a cloudy day.",
//                   "title": "Great Egg Harbor River",
//                   "id": 6792,
//                   "caption": "The Great Egg Harbor River",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/4289A3A9-1DD8-B71B-0BFCF884DB700B09.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "Medium sized Osprey in a next along the river",
//                   "title": "Tuckahoe Osprey",
//                   "id": 6793,
//                   "caption": "Tuckahoe Osprey",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/42912E18-1DD8-B71B-0BB2C9B86833D9CF.jpg"
//               }
//           ],
//           "designation": "",
//           "parkCode": "greg",
//           "id": "5B1021C9-5F48-4747-B0E4-6F508FDF96AE",
//           "fullName": "Great Egg Harbor River"
//       },
//       {
//           "states": "CO",
//           "directionsInfo": "To access the main park area, including the Dunes Parking Lot, Visitor Center, and Pinyon Flats Campground, take US 160 to CO 150 from the south, or CO 17 to Lane 6 to CO 150 from the west. The national park is at the north end of CO 150.",
//           "directionsUrl": "http://www.nps.gov/grsa/planyourvisit/directions.htm",
//           "url": "https://www.nps.gov/grsa/index.htm",
//           "weatherInfo": "Temperatures are relatively cool all year, thanks to the park and preserve's high elevation. Conditions are most often calm, but winds can arise, especially in spring and during storm fronts.  Daytime temperatures feel warmer here year round due to intense high-altitude sunlight, and a scorching mid-day summer sand surface. Plan to explore the dunes morning or evening during summer. Nights are cool in summer, and frigid in winter. Visit the Great Sand Dunes website for the most accurate weather forecasts.",
//           "name": "Great Sand Dunes",
//           "latLong": "lat:37.79256812, long:-105.5919572",
//           "description": "The tallest dunes in North America are the centerpiece in a diverse landscape of grasslands, wetlands, conifer and aspen forests, alpine lakes, and tundra. Experience this diversity through hiking, sand sledding, splashing in Medano Creek, wildlife watching, and more! The park and preserve are always open, so plan to also experience night skies and nocturnal wildlife during your visit.",
//           "images": [
//               {
//                   "credit": "NPS/Patrick Myers",
//                   "altText": "View of Dunes and Sangre de Cristo Mountains from Park Entrance",
//                   "title": "View of Dunes and Sangre de Cristo Mountains from Park Entrance",
//                   "id": 1743,
//                   "caption": "The classic view from the Great Sand Dunes main entrance",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7CE386-1DD8-B71B-0B14D302825B96CF.jpg"
//               },
//               {
//                   "credit": "NPS/Patrick Myers",
//                   "altText": "Children Floating Medano Creek",
//                   "title": "Children Floating Medano Creek",
//                   "id": 1744,
//                   "caption": "Medano Creek is a popular beach environment at the base of the Great Sand Dunes. It flows seasonally April through June, with peak flow in late May.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7CE533-1DD8-B71B-0BE6ECE3FE72864F.jpg"
//               },
//               {
//                   "credit": "NPS/Patrick Myers",
//                   "altText": "Girls Sand Sledding",
//                   "title": "Girls Sand Sledding",
//                   "id": 1745,
//                   "caption": "Rent specially designed sand sleds to slide on the dry sand.  Note: cardboard, snow sleds, saucers, and other items don't slide on dry sand.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7CE6BD-1DD8-B71B-0B572A2B7842A510.jpg"
//               },
//               {
//                   "credit": "NPS/Patrick Myers",
//                   "altText": "Girl Sandboarding",
//                   "title": "Girl Sandboarding",
//                   "id": 1746,
//                   "caption": "Rent a specially designed sandboard or sand sled. Note: cardboard, snow sleds, saucers, etc. don't slide on dry sand.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7CEB1F-1DD8-B71B-0BC4F0E859616353.jpg"
//               },
//               {
//                   "credit": "NPS/Patrick Myers",
//                   "altText": "Girl Sandboarding Above Castle Creek Picnic Area",
//                   "title": "Girl Sandboarding Above Castle Creek Picnic Area",
//                   "id": 1749,
//                   "caption": "Rent specially designed sandboards or sand sleds. Note: cardboard, snow sleds, saucers, etc. don't slide on dry sand.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7CF074-1DD8-B71B-0B0BF58DDA2F87F4.jpg"
//               },
//               {
//                   "credit": "NPS/Patrick Myers",
//                   "altText": "Girl in Medano Creek",
//                   "title": "Girl in Medano Creek",
//                   "id": 1750,
//                   "caption": "Medano Creek is a popular seasonal stream that flows around the base of the dunes in late spring/early summer.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7CF1EA-1DD8-B71B-0BC3286B5A2E2406.jpg"
//               },
//               {
//                   "credit": "NPS/Patrick Myers",
//                   "altText": "Campsite in Pinyon Flats Campground",
//                   "title": "Campsite in Pinyon Flats Campground",
//                   "id": 1751,
//                   "caption": "Pinyon Flats has 88 individual sites, located in the foothills of the Sangre de Cristo Mountains",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7CF38A-1DD8-B71B-0B747D0888BEB323.jpg"
//               },
//               {
//                   "credit": "NPS/Patrick Myers",
//                   "altText": "Pinyon Flats Campground",
//                   "title": "Pinyon Flats Campground",
//                   "id": 1752,
//                   "caption": "Pinyon Flats Campground is a National Park Service campground located in Great Sand Dunes National Park.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7CF540-1DD8-B71B-0B4C515DF0CD1117.jpg"
//               },
//               {
//                   "credit": "NPS/Patrick Myers",
//                   "altText": "Woman Beside Waterfall, Sand Creek Basin, Great Sand Dunes National Preserve",
//                   "title": "Woman Beside Waterfall, Sand Creek Basin, Great Sand Dunes National Preserve",
//                   "id": 1753,
//                   "caption": "Woman Beside Waterfall, Sand Creek Basin, Great Sand Dunes National Preserve",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7CF751-1DD8-B71B-0B145505578E5C13.jpg"
//               },
//               {
//                   "credit": "NPS/Patrick Myers",
//                   "altText": "Woman at Cottonwood Pass, Sand Creek Basin, Great Sand Dunes National Preserve",
//                   "title": "Woman at Cottonwood Pass, Sand Creek Basin, Great Sand Dunes National Preserve",
//                   "id": 1754,
//                   "caption": "Woman at Cottonwood Pass, Sand Creek Basin, Great Sand Dunes National Preserve",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7CF8FC-1DD8-B71B-0B43C4B4533D2A12.jpg"
//               },
//               {
//                   "credit": "NPS/Patrick Myers",
//                   "altText": "Gold Cottonwoods, Dunes, and Cleveland Peak",
//                   "title": "Gold Cottonwoods, Dunes, and Cleveland Peak",
//                   "id": 1755,
//                   "caption": "Gold Cottonwoods, Dunes, and Cleveland Peak",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7CFAF7-1DD8-B71B-0B737B524CCBACAB.jpg"
//               },
//               {
//                   "credit": "NPS/Patrick Myers",
//                   "altText": "Gold Aspens, Dunes, and Cleveland Peak",
//                   "title": "Gold Aspens, Dunes, and Cleveland Peak",
//                   "id": 1756,
//                   "caption": "Visit in late September/early October to experience aspens at peak above the dunes.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7CFC71-1DD8-B71B-0B05BCFDF61D4CB9.jpg"
//               },
//               {
//                   "credit": "",
//                   "altText": "Elk, Grasslands, Dunes, and Sangre de Cristo Mountains",
//                   "title": "Elk, Grasslands, Dunes, and Sangre de Cristo Mountains",
//                   "id": 1757,
//                   "caption": "Elk are sometimes seen by visitors along the park entrance road or County Lane 6, primarily fall through spring.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7CFDEA-1DD8-B71B-0B5A198106C9A109.jpg"
//               },
//               {
//                   "credit": "NPS/Patrick Myers",
//                   "altText": "Sandhill Cranes Dancing, Dunes, and Mount Herard",
//                   "title": "Sandhill Cranes Dancing, Dunes, and Mount Herard",
//                   "id": 1758,
//                   "caption": "Sandhill cranes spend part of the spring and fall in the San Luis Valley each year. Look for them in farm fields during daytime, then in wetlands from sunset to sunrise.  In spring, they dance to attract mates.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7CFF90-1DD8-B71B-0B47BACD37D2542C.jpg"
//               },
//               {
//                   "credit": "NPS/Kris Illenberger",
//                   "altText": "Lower Sand Creek Lake, Great Sand Dunes National Preserve",
//                   "title": "Lower Sand Creek Lake, Great Sand Dunes National Preserve",
//                   "id": 1759,
//                   "caption": "Spectacular alpine lakes are part of the backcountry of Great Sand Dunes National Preserve",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7D0109-1DD8-B71B-0B95485B738AE811.jpg"
//               },
//               {
//                   "credit": "NPS/Patrick Myers",
//                   "altText": "Upper Sand Creek Basin, Great Sand Dunes National Preserve",
//                   "title": "Upper Sand Creek Basin, Great Sand Dunes National Preserve",
//                   "id": 1760,
//                   "caption": "Sand Creek Basin, part of Great Sand Dunes National Preserve, contains lush forests and alpine lakes.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7D0254-1DD8-B71B-0B302F546130C0B3.jpg"
//               },
//               {
//                   "credit": "NPS/Patrick Myers",
//                   "altText": "Girls Hiking in Gold Aspens, Mosca Pass, Great Sand Dunes National Preserve",
//                   "title": "Girls Hiking in Gold Aspens, Mosca Pass, Great Sand Dunes National Preserve",
//                   "id": 1761,
//                   "caption": "Girls Hiking in Gold Aspens, Mosca Pass, Great Sand Dunes National Preserve",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7D039E-1DD8-B71B-0B39869E4C5026BF.jpg"
//               },
//               {
//                   "credit": "NPS/Patrick Myers",
//                   "altText": "Boy Next to Mosca Creek, Montville Loop Trail, Great Sand Dunes National Park",
//                   "title": "Boy Next to Mosca Creek, Montville Loop Trail, Great Sand Dunes National Park",
//                   "id": 1762,
//                   "caption": "Boy Next to Mosca Creek, Montville Loop Trail, Great Sand Dunes National Park",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7D0510-1DD8-B71B-0B173BC37541AFC9.jpg"
//               },
//               {
//                   "credit": "NPS/Dan Carver",
//                   "altText": "Hikers on Dunefield at Sunset",
//                   "title": "Hikers on Dunefield at Sunset",
//                   "id": 1763,
//                   "caption": "Plan to hike the dunes in early morning or evening during summer to avoid 150 F sand temperatures or lightning.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7D06CD-1DD8-B71B-0B7CCF38215298CF.jpg"
//               },
//               {
//                   "credit": "NPS/Patrick Myers",
//                   "altText": "Sandhill Cranes Flying Over Wetland West of Dunefield",
//                   "title": "Sandhill Cranes Flying Over Wetland West of Dunefield",
//                   "id": 1764,
//                   "caption": "Sandhill cranes spend part of each spring and fall in the San Luis Valley.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7D0853-1DD8-B71B-0BF51F01016FB5CC.jpg"
//               },
//               {
//                   "credit": "NPS/Patrick Myers",
//                   "altText": "Wetland, Great Sand Dunes National Park",
//                   "title": "Wetland, Great Sand Dunes National Park",
//                   "id": 1765,
//                   "caption": "Wetlands west of the dunefield are lush and green in mid-summer.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7D0A0B-1DD8-B71B-0BCA910575D053B2.jpg"
//               },
//               {
//                   "credit": "NPS/Patrick Myers",
//                   "altText": "Fall Colors Along Mosca Creek, Great Sand Dunes National Park",
//                   "title": "Fall Colors Along Mosca Creek, Great Sand Dunes National Park",
//                   "id": 1766,
//                   "caption": "Fall is a pretty time to visit the park, with great colors and generally nice weather.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7D0B9A-1DD8-B71B-0B62FA4120CA0DE8.jpg"
//               },
//               {
//                   "credit": "NPS/Patrick Myers",
//                   "altText": "Red Osier Dogwood and Aspens in Fall, Mosca Creek, Great Sand Dunes National Park",
//                   "title": "Red Osier Dogwood and Aspens in Fall, Mosca Creek, Great Sand Dunes National Park",
//                   "id": 1767,
//                   "caption": "Red Osier Dogwood and Aspens in Fall, Mosca Creek, Great Sand Dunes National Park. Hike the Mosca Pass Trail in fall for views like this.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7D0D45-1DD8-B71B-0BB8DE576C21B0A2.jpg"
//               }
//           ],
//           "designation": "National Park & Preserve",
//           "parkCode": "grsa",
//           "id": "461D40CC-4379-4C1B-ADB8-3563147F61A1",
//           "fullName": "Great Sand Dunes National Park & Preserve"
//       },
//       {
//           "states": "TX",
//           "directionsInfo": "Guadalupe Mountains National Park is located on the north side of US Hwy 62/180. \nIf you are traveling east from El Paso, TX, we are 110 miles East of the city. Follow US Hwy 62/180 North to the Pine Springs Visitor Center. \nIf you are traveling from Van Horn, TX, you will travel north on US 54 and make a left hand turn at the junction of US 62/180 to arrive at the park.\nIf you are traveling west from Carlsbad, NM, you will travel on US Hwy 62/180 South and cross into Texas. Follow signs to the park.",
//           "directionsUrl": "http://www.nps.gov/gumo/planyourvisit/directions.htm",
//           "url": "https://www.nps.gov/gumo/index.htm",
//           "weatherInfo": "Weather in the Guadalupe Mountains can change in an instant. In the Spring and Summer, average temperatures vary with highs between 70F-80F+ with evening lows in the 40F-60F range. The Fall and Winter bring milder temperatures with highs in between 50F-60F with evening lows in the 30F-50F range.",
//           "name": "Guadalupe Mountains",
//           "latLong": "lat:31.92304462, long:-104.885527",
//           "description": "Guadalupe Mountains National Park protects the world's most extensive Permian fossil reef, the four highest peaks in Texas, an environmentally diverse collection of flora and fauna, and the stories of lives shaped through conflict, cooperation and survival. Come experience mountains and canyons, desert and dunes, night skies and spectacular vistas within a place unlike any other within the NPS.",
//           "images": [
//               {
//                   "credit": "NPS Photo/Bieri",
//                   "altText": "El Capitan with blooming claret cup cacti",
//                   "title": "El Capitan",
//                   "id": 3574,
//                   "caption": "Blossoming claret cup cacti add a splash of color to the Chihuahuan desert.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C825533-1DD8-B71B-0B6FDF436F604A3C.jpg"
//               },
//               {
//                   "credit": "NPS Photo/Flores",
//                   "altText": "Fall colors in Devil's Hall",
//                   "title": "Devil's Hall Fall Colors",
//                   "id": 3575,
//                   "caption": "Changing maple trees line the Devil's Hall trail during the fall months.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C8256DA-1DD8-B71B-0B7E4BE83A8B56F9.jpg"
//               },
//               {
//                   "credit": "NPS Photo/Buehler",
//                   "altText": "Pratt Cabin in McKittrick Canyon",
//                   "title": "Pratt Cabin",
//                   "id": 3576,
//                   "caption": "Pratt Cabin is nestled in McKittrick Canyon with abundant trees and",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C82588D-1DD8-B71B-0B233383D71368EB.jpg"
//               },
//               {
//                   "credit": "NPS Photo/Yates",
//                   "altText": "the slat flats become flooded during monsoon months after large rain events.",
//                   "title": "Flooded Salt Flats",
//                   "id": 3577,
//                   "caption": "After the monsoon storms, the salt flats will often become flooded creating a seasonal lake.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C825A11-1DD8-B71B-0BAAA0BDF174AA2F.jpg"
//               },
//               {
//                   "credit": "NPS Photo/Bieri",
//                   "altText": "wildflowers blossom along The Bowl trail",
//                   "title": "The Bowl wildflowers",
//                   "id": 3623,
//                   "caption": "During the spring months, wildflowers are a common sight along The Bowl trail.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C82A652-1DD8-B71B-0B7E219169341CAD.jpg"
//               }
//           ],
//           "designation": "National Park",
//           "parkCode": "gumo",
//           "id": "6510001B-685D-4688-A963-4ECE7AB609DB",
//           "fullName": "Guadalupe Mountains National Park"
//       },
//       {
//           "states": "AR",
//           "directionsInfo": "Hot Springs National Park is a 5,500 acre park in the city of Hot Springs.  Bathhouse Row, a quarter mile long collection of eight bathhouses along the east side of Central Avenue, is the most visited area within the national park.",
//           "directionsUrl": "http://www.nps.gov/hosp/planyourvisit/directions.htm",
//           "url": "https://www.nps.gov/hosp/index.htm",
//           "weatherInfo": "Temperatures range from >100°F (38°C) to <20°F (-7°C). \nSpring has the highest average rainfall. \nSummer temperatures frequently reach the triple-digit range and high humidity \nFall begins fall colors and cooler temperatures. Frost starts to become more common.\nWinter  temperatures often fall below 33 degrees and occasionally drop below 0. Roads may be icy. \nYour visit can be more enjoyable by checking the forecast and coming prepared for hikes or walks in the park.",
//           "name": "Hot Springs",
//           "latLong": "lat:34.52414366, long:-93.06332936",
//           "description": "Water. That's what first attracted people, and they have been coming here ever since to use these soothing thermal waters to heal and relax. Rich and poor alike came for the baths, and a thriving city built up around the hot springs. Together nicknamed \"The American Spa,\" Hot Springs National Park today surrounds the north end of the city of Hot Springs, Arkansas. Come discover it for yourself.",
//           "images": [
//               {
//                   "credit": "Hot Springs National Park",
//                   "altText": "Hot Water Pools",
//                   "title": "Thermal Water Springs",
//                   "id": 3699,
//                   "caption": "Pools of Thermal Water at Hot Springs National Park",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C8309AE-1DD8-B71B-0B640467D9BE54A5.jpg"
//               }
//           ],
//           "designation": "National Park",
//           "parkCode": "hosp",
//           "id": "ED9C0322-68FB-4DE1-A884-61C623281C9D",
//           "fullName": "Hot Springs National Park"
//       },
//       {
//           "states": "SD",
//           "directionsInfo": "By car:  Jewel Cave National Monument is located 13 miles west of Custer, South Dakota and 24 miles east of Newcastle, Wyoming on U.S. Highway 16. The Monument is about 54 miles from Rapid City, South Dakota via U.S. Highway 16 / 385.\n\nBy plane:  The nearest major airport, Rapid City Regional Airport, is 63 miles away.",
//           "directionsUrl": "http://www.nps.gov/jeca/planyourvisit/directions.htm",
//           "url": "https://www.nps.gov/jeca/index.htm",
//           "weatherInfo": "Spring:  Rain or snow is common.  Temperatures vary.\n\nSummer:  Rain is common in June.  Sunny and dry in July and August.  Temperatures range from 70 to 95 degrees Fahrenheit.\n\nFall:  Mild temperatures and occasional rain or snow showers.\n\nWinter:  Cold temperatures are common with occasional snow.",
//           "name": "Jewel Cave",
//           "latLong": "lat:43.73102945, long:-103.829994",
//           "description": "Immerse yourself within the third longest cave in the world. With over 195 miles of mapped and surveyed passages, this underground wilderness appeals to human curiosity. Its splendor is revealed through fragile formations and glimpses of brilliant color. Its maze of passages lure explorers, and its scientific wealth remains a mystery. This resource is truly a jewel in the National Park Service.",
//           "images": [
//               {
//                   "credit": "NPS Photo/Dan Austin",
//                   "altText": "A cave explorer rests by large stalagmites that are covered in cave popcorn.",
//                   "title": "Pinnacles Expressway",
//                   "id": 1769,
//                   "caption": "The logomites or popcorn stalagmites this explorer sits near are hollow and sometimes grow taller than a person.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7D1062-1DD8-B71B-0BB1862297F951F8.jpg"
//               },
//               {
//                   "credit": "NPS Photo/Dan Austin",
//                   "altText": "A cave explorer looks at a clear blue lake in Jewel Cave",
//                   "title": "Hourglass Lake",
//                   "id": 1770,
//                   "caption": "Hourglass Lake was discovered in October 2015 and is the first sizable body of water to be found in Jewel Cave.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7D11EA-1DD8-B71B-0BCC921BDE9A9253.jpg"
//               },
//               {
//                   "credit": "NPS Photo/Dan Austin",
//                   "altText": "A park ranger walks on the Scenic Tour Route in Jewel Cave",
//                   "title": "Inner Sanctum",
//                   "id": 1771,
//                   "caption": "The Inner Sanctum is a large passage on the Jewel Cave Scenic Tour near the Torture Room",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7D1365-1DD8-B71B-0BEF0C64C6FA265F.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "A tour participant squeezes through a very small passage on the Wild Caving Tour",
//                   "title": "The Brain Drain",
//                   "id": 1772,
//                   "caption": "The Brain Drain is approximately 8 inches high by 24 inches wide and is the tightest passage on the Wild Caving Tour.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7D14CA-1DD8-B71B-0BFB17D039DD3B5F.jpg"
//               },
//               {
//                   "credit": "NPS Photo/Dan Austin",
//                   "altText": "A park ranger stands in a medium-sized room in Jewel Cave",
//                   "title": "The Heavenly Room",
//                   "id": 1773,
//                   "caption": "The Heavenly Room lies at the end of the Jewel Cave Historic Lantern Tour.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7D1629-1DD8-B71B-0BC7B364204E089C.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "These calcite crystals, called Nailhead Spar, are the jewels of Jewel Cave",
//                   "title": "Nailhead Spar",
//                   "id": 1774,
//                   "caption": "These calcite crystals, called Nailhead Spar, are the jewels of Jewel Cave",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7D1784-1DD8-B71B-0B48192F22E64243.jpg"
//               }
//           ],
//           "designation": "National Monument",
//           "parkCode": "jeca",
//           "id": "A71EF659-5A33-4CCC-93CE-340F23A88E3E",
//           "fullName": "Jewel Cave National Monument"
//       },
//       {
//           "states": "CA",
//           "directionsInfo": "Please visit our main website for specific directions to our park. You may call the John Muir Visitor Center for additional information.",
//           "directionsUrl": "http://www.nps.gov/jomu/planyourvisit/directions.htm",
//           "url": "https://www.nps.gov/jomu/index.htm",
//           "weatherInfo": "The Mediterranean climate of Martinez features hot, dry summers with lower temperatures near 60º F and upper temperatures near 100º F. The heat gives way to cool, rainy winters with lows near 45º F and highs near 75º F. Fall and spring can bring rain and temperatures from 55-80º F.\n\nMarch to April: wet/dry, 60-80º F\nMay to September: very dry, 60-100º+ F\nOctober to November: dry/wet, 55-80º F\nDecember to February: wet, 45-75º F",
//           "name": "John Muir",
//           "latLong": "lat:37.9828422, long:-122.1326097",
//           "description": "John Muir played many roles in his life, all of which helped him succeed in his role as an advocate for Nature. As America’s most famous naturalist and conservationist, Muir fought to protect the wild places he loved, places we can still visit today. Muir’s writings convinced the U.S. government to protect Yosemite, Sequoia, Grand Canyon and Mt. Rainier as national parks.",
//           "images": [
//               {
//                   "credit": "NPS Photo",
//                   "altText": "John Muir Home at the John Muir National Historic Site",
//                   "title": "John Muir Home at the John Muir National Historic Site",
//                   "id": 231,
//                   "caption": "John Muir Home at the John Muir National Historic Site",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C79DF6A-1DD8-B71B-0B64749528CB4952.jpg"
//               }
//           ],
//           "designation": "National Historic Site",
//           "parkCode": "jomu",
//           "id": "F339067B-A588-4BF3-9D90-1C1BA1249203",
//           "fullName": "John Muir National Historic Site"
//       },
//       {
//           "states": "AK",
//           "directionsInfo": "Kenai Fjords National Park is located just outside the town of Seward in south-central Alaska, 126 miles south of Anchorage. Even though the park is often inaccessible during the winter months, Seward is accessible year-round via the Seward Highway, a National Scenic Byway.\n\nFollow the Seward Highway (AK-1) south from Anchorage. It will become AK-9 around mile 35 (87 miles from Anchorage) with AK-1 heading to Homer and Kenai. Continue on AK-9 to Seward.",
//           "directionsUrl": "http://www.nps.gov/kefj/planyourvisit/directions.htm",
//           "url": "https://www.nps.gov/kefj/index.htm",
//           "weatherInfo": "The weather  Kenai Fjords is difficult to predict and can change rapidly. The area generally enjoys a relatively temperate maritime climate, primarily due to the influence of the Japanese current that flows through the Gulf of Alaska.\n\nSummer daytime temperatures range from the mid 40s to the low 70s (Fahrenheit). Overcast and cool rainy days are frequent. Winter temperatures can range from the low 30s to -20.",
//           "name": "Kenai Fjords",
//           "latLong": "lat:59.81804414, long:-150.106502",
//           "description": "At the edge of the Kenai Peninsula lies a land where the ice age lingers. Nearly 40 glaciers flow from the Harding Icefield, Kenai Fjords' crowning feature. Wildlife thrives in icy waters and lush forests around this vast expanse of ice. Sugpiaq people relied on these resources to nurture a life entwined with the sea. Today, shrinking glaciers bear witness to the effects of our changing climate.",
//           "images": [
//               {
//                   "credit": "USGS/Bruce Molnia",
//                   "altText": "aerial image of Bear Glacier",
//                   "title": "Bear Glacier Aerial",
//                   "id": 171,
//                   "caption": "Bear Glacier is the largest of nearly 40 glaciers that flow from the Harding Icefield.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C798EAB-1DD8-B71B-0BC4BEFB197F2C90.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "kayakers in front of a tidewater glacier",
//                   "title": "Aialik Bay Kayakers",
//                   "id": 1898,
//                   "caption": "Kayakers enjoy the spectacular scenery in the fjords in Aialik Bay.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7DE352-1DD8-B71B-0B35831ADF254DE0.jpg"
//               },
//               {
//                   "credit": "NPS Photo/Thoresen",
//                   "altText": "a humpback whale breaches",
//                   "title": "Humpback Whale Breach",
//                   "id": 1899,
//                   "caption": "A humpback whale breaches in Kenai Fjords National Park",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7DE50D-1DD8-B71B-0B23431BC04ACB33.jpg"
//               },
//               {
//                   "credit": "USGS/Bruce Molnia",
//                   "altText": "aerial view of Bear Glacier from Harding Icefield",
//                   "title": "Above Bear Glacier",
//                   "id": 1900,
//                   "caption": "Flightseeing over the Harding Icefield provides amazing opportunities to view glaciers, like Bear Glacier, from a different perspective.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7DE88C-1DD8-B71B-0B3F02FD7F30F1AF.jpg"
//               },
//               {
//                   "credit": "NPS Photo/Jim Pfeiffenberger",
//                   "altText": "visitors at accessible overlook of Exit Glacier and Exit Creek.",
//                   "title": "Exit Glacier View",
//                   "id": 1901,
//                   "caption": "A stroll to Glacier View provides a nice overlook of Exit Glacier as part of a 1 mile accessible walk.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7DEEE0-1DD8-B71B-0B7B85B29F07C371.jpg"
//               }
//           ],
//           "designation": "National Park",
//           "parkCode": "kefj",
//           "id": "11E73438-0CCC-4441-A76A-1995F67F2D89",
//           "fullName": "Kenai Fjords National Park"
//       },
//       {
//           "states": "CA",
//           "directionsInfo": "From Interstate 5, take Hwy 44 - 48 miles east to the junction of Hwy 89. Follow Hwy 89 south 1 mile to the north entrance of the park or take Hwy 36 E - 51 miles east to the junction of Hwy 89. Follow Hwy 89 north 6 miles to south entrance of the park.",
//           "directionsUrl": "http://www.nps.gov/lavo/planyourvisit/directions.htm",
//           "url": "https://www.nps.gov/lavo/index.htm",
//           "weatherInfo": "Weather at Lassen can vary dramatically throughout the year. Learn more about Lassen's weather.\nThe nearby town of Susanville has a humid continental climate, with cold winters and very warm, mostly dry summers. Average January temperatures are a high of 40.4 °F (4.7 °C) and a low of 20.8 °F (-6.2 °C). Average July temperatures are a high of 88.4 °F and a low of 49.8 °F. Temperatures reach 90 °F or higher on an average of 36.9 days, and drop to 32 ° or lower on an average of 164 days days annually.",
//           "name": "Lassen Volcanic",
//           "latLong": "lat:40.49354575, long:-121.4075993",
//           "description": "Lassen Volcanic National Park is home to steaming fumaroles, meadows freckled with wildflowers, clear mountain lakes, and numerous volcanoes. Jagged peaks tell the story of its eruptive past while hot water continues to shape the land. Lassen Volcanic offers opportunities to discover the wonder and mysteries of volcanoes and hot water for visitors willing to explore the undiscovered.",
//           "images": [
//               {
//                   "credit": "NPS Photo / Scott Arnaz",
//                   "altText": "A frozen lake below snow-covered trees and peak",
//                   "title": "Winter at Manzanita Lake",
//                   "id": 4411,
//                   "caption": "With over 30 feet of snowfall annually, Lassen provides numerous opportunities for winter recreation.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C873811-1DD8-B71B-0B9C62ED8E12E7B5.jpg"
//               },
//               {
//                   "credit": "NPS Photo / Amanda Sweeney",
//                   "altText": "Golden grasses edge a pond reflecting a snow-dusted peak",
//                   "title": "Hat Creek",
//                   "id": 4412,
//                   "caption": "Lassen Volcanic's rugged volcanic landscape is softened by numerous meadows, lakes, and creeks.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C8739BB-1DD8-B71B-0B8336A925B1A6C7.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "A boardwalk passes through a colorful, steaming hydrothermal basin.",
//                   "title": "Bumpass Hell",
//                   "id": 4413,
//                   "caption": "A 3-mile round-trip trail leads to Bumpass Hell, the largest of the park's hydrothermal areas.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C873B2E-1DD8-B71B-0B28C044BC4B9DC6.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "Two hikers sit on a mountain top with a view of multiple peaks, dotted with patches of snow",
//                   "title": "Brokeoff Panorama",
//                   "id": 4414,
//                   "caption": "Over 150 miles of trails let you choose your adventure.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C873CC3-1DD8-B71B-0B076FC2806DF140.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "A volcanic peak rises above a tree-lined, deep blue lake.",
//                   "title": "Deep Blue",
//                   "id": 4415,
//                   "caption": "Lassen Peak stands out boldly between the bright blue sky and the sapphire hue of Lake Helen.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C873E3A-1DD8-B71B-0BBD47F2E441D2F7.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "A fisherman casts a line from a boat below a snow-dotted volcanic peak.",
//                   "title": "A Fisherman's Paradise",
//                   "id": 4416,
//                   "caption": "Manzanita Lake offers spectacular catch-and-release fishing in the shadow of volcanoes.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C874252-1DD8-B71B-0B6BC0D39B9A51C2.jpg"
//               },
//               {
//                   "credit": "NPS Photo / B.F. Loomis",
//                   "altText": "An ash cloud rises above a volcano with an early 19th century vehicle at the forefront.",
//                   "title": "Lassen Peak Eruption",
//                   "id": 4418,
//                   "caption": "A large, explosive eruption of Lassen Peak brought national attention and set the stage for the establishment of Lassen Peak.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C8743DC-1DD8-B71B-0B1DE16014F1A63F.jpg"
//               }
//           ],
//           "designation": "National Park",
//           "parkCode": "lavo",
//           "id": "9AA4A53C-0331-43CC-99F5-379BC929FFB2",
//           "fullName": "Lassen Volcanic National Park"
//       },
//       {
//           "states": "PA,NJ",
//           "directionsInfo": "The Lower Delaware National Wild and Scenic River is located between Interstate 80 (at Portland, Pennsylvania and Columbia, New Jersey) and Interstate 95 (at exit 51 in Washington Crossing, Pennsylvania and exit 1 in Washington Crossing, New Jersey).\n\nIn Pennsylvania, follow PA-611 and PA-32 to drive along the river.\n\nIn New Jersey, follow NJ-29 south of Frenchtown for a drive along the river.",
//           "directionsUrl": "http://www.nps.gov/lode/planyourvisit/directions.htm",
//           "url": "https://www.nps.gov/lode/index.htm",
//           "weatherInfo": "Spring: Temperatures usually range from lows of 26 F to highs of 80 F with average rainfall of 5 inches.\n\nSummer: Temperatures usually range from lows of 55 F to highs of 85 F with average rainfall of 4 inches. \n\nFall: Temperatures usually range from lows of 30 F to highs of 83F. Fall foliage is at its peak sometime in October as daily mountain temperatures vary frequently and influence the change.\n\nWinter: Temperatures usually range from lows of 15 F to highs of 49 F.",
//           "name": "Lower Delaware",
//           "latLong": "",
//           "description": "The largest free-flowing river in the eastern United States, the Delaware River runs past forests, farmlands, and villages, and it also links some of the most densely populated regions in America.\n\nIn 2000, the National Wild and Scenic River System incorporated key segments of the lower Delaware River to form this unit of the National Park System.",
//           "images": [
//               {
//                   "credit": "NPS Photo/Julia Bell",
//                   "altText": "A rural boat lock with a gate",
//                   "title": "Delaware Canal at Raubsville, Locks 22 & 23",
//                   "id": 305,
//                   "caption": "Locks were used to move boats overland via canals",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7A403C-1DD8-B71B-0B48D4D57314EA3D.jpg"
//               },
//               {
//                   "credit": "NPS Photo/Julia Bell",
//                   "altText": "An old stone-pier bridge over a river",
//                   "title": "Raven Rock Bridge",
//                   "id": 306,
//                   "caption": "The Bridge from Lumberville, PA to Bulls Island Recreation Area, NJ",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7A4199-1DD8-B71B-0BBB639114F35E91.jpg"
//               },
//               {
//                   "credit": "NPS Photo/Julia Bell",
//                   "altText": "Kayakers enter the river from a riverside beach",
//                   "title": "Delaware River Sojourners",
//                   "id": 307,
//                   "caption": "Sojourners enter the river at Martins Creek, PA",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7A42DB-1DD8-B71B-0BD49DA7BCB7957C.jpg"
//               },
//               {
//                   "credit": "NPS Photo/Julia Bell",
//                   "altText": "butterfly lands on a maple leaf",
//                   "title": "Red Admiral Butterfly",
//                   "id": 308,
//                   "caption": "Butterfly at Delaware Canal State Park near Upper Black Eddy, PA",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7A4445-1DD8-B71B-0B3381881EA2DFAC.jpg"
//               },
//               {
//                   "credit": "NPS Photo/Julia Bell",
//                   "altText": "water falls over a layered stone cliff face",
//                   "title": "Ringing Rocks County Park",
//                   "id": 309,
//                   "caption": "Visitors overlook the waterfall",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7A45C5-1DD8-B71B-0BFD51D64F58C9A9.jpg"
//               }
//           ],
//           "designation": "National Wild and Scenic River",
//           "parkCode": "lode",
//           "id": "64FF65B7-0847-4495-9464-667CAFBF4D16",
//           "fullName": "Lower Delaware National Wild and Scenic River"
//       },
//       {
//           "states": "ME",
//           "directionsInfo": "The Saint John Valley is located in northern Aroostook County, Maine, 200 miles north of Bangor at the northern terminus of ME 1. It is best reached by private vehicle. From Interstate 95, use exits at Sherman or Smyrna Mills for Route 11 to Fort Kent, or the exit at Houlton for U.S. Route 1 North.",
//           "directionsUrl": "http://www.nps.gov/maac/planyourvisit/directions.htm",
//           "url": "https://www.nps.gov/maac/index.htm",
//           "weatherInfo": "Located in remote northern Maine, Aroostook County experiences all four seasons. Summers temperatures average highs near 75° F (23° C) while winter temperatures average lows often below 0° F (-17° C). Snow falls typically from November through April and averages well over 100 inches of snow per winter.",
//           "name": "Maine Acadian Culture",
//           "latLong": "lat:47.2831115723, long:-68.4110870361",
//           "description": "Maine Acadians share beliefs and experiences tying them to a common religion, languages, and history. The St. John River, land, and family are essential to their culture. The National Park Service supports the Maine Acadian Heritage Council, an association of historical societies, cultural clubs, towns, and museums that work together to support Maine Acadian culture in the St. John Valley.",
//           "images": [
//               {
//                   "credit": "NPS Photo",
//                   "altText": "Scenic view of Acadian Village",
//                   "title": "Acadian Village",
//                   "id": 473,
//                   "caption": "Scenic view of Acadian Village",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7B3A97-1DD8-B71B-0BCDEEBD8170AEE0.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "Our Lady of Assumption Church, Acadian Village",
//                   "title": "Our Lady of Assumption Church, Acadian Village",
//                   "id": 475,
//                   "caption": "Our Lady of Assumption Church, Acadian Village",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7B3D6B-1DD8-B71B-0B4EF1854FFA3650.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "Mont-Carmel, newly painted in original color scheme.",
//                   "title": "Mont-Carmel",
//                   "id": 476,
//                   "caption": "Mont-Carmel, newly painted in original color scheme.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7B3EE0-1DD8-B71B-0B489A51A45FA82C.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "St Francis Historical Society and Gardens",
//                   "title": "St Francis Historical Society and Gardens",
//                   "id": 477,
//                   "caption": "St Francis Historical Society and Gardens",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7B4044-1DD8-B71B-0BDAE48C1C7FD84D.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "This site preserves one of a few surviving train water tanks in the United States and a 1940s era ca",
//                   "title": "Bangor/Aroostook Caboose & Green Water Tank",
//                   "id": 480,
//                   "caption": "This site preserves one of a few surviving train water tanks in the United States and a 1940s era caboose",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7B4469-1DD8-B71B-0BFBFEB48111481B.jpg"
//               }
//           ],
//           "designation": "",
//           "parkCode": "maac",
//           "id": "A609887A-BB48-47AA-A6F6-4C7F77346FC6",
//           "fullName": "Maine Acadian Culture"
//       },
//       {
//           "states": "KY",
//           "directionsInfo": "DO NOT FOLLOW YOUR GPS!\n\nFrom the North: Take Interstate 65 to Exit 53 (Cave City Exit). Turn right onto KY-70. Follow 70/255 as it becomes the Mammoth Cave Parkway in the park. Follow the Mammoth Cave Parkway to the Visitor Center.\n\nFrom the South: Take Interstate 65 to Exit 48 (Park City Exit). Turn left onto KY-255 and follow 255 as it becomes the Park City Road into the park. Follow Park City Road until it joins the Mammoth Cave Parkway; turn left. Follow the Mammoth Cave Parkway to the Visitor Center.",
//           "directionsUrl": "http://www.nps.gov/maca/planyourvisit/directions.htm",
//           "url": "https://www.nps.gov/maca/index.htm",
//           "weatherInfo": "Kentucky has a moderate climate with warm, yet moist conditions. Summers average in the high 80s; winters average in the low 40s. Southern Kentucky, where Mammoth Cave is located, receives the highest average precipitation for the state, about 50 inches per year, mostly in spring. Winter can bring mild to moderate snow and ice. Storms happen year-round, and can include tornadoes and flooding in low-lying areas, but severe weather is infrequent. The temperature deep in the cave is a constant 54°F (12°C).",
//           "name": "Mammoth Cave",
//           "latLong": "lat:37.19760458, long:-86.13090198",
//           "description": "Mammoth Cave National Park preserves the cave system and a part of the Green River valley and hilly country of south central Kentucky. This is the world's longest known cave system, with more than 400 miles (643 km) explored. Early guide Stephen Bishop called the cave a \"grand, gloomy and peculiar place,\" but its vast chambers and complex labyrinths have earned its name - Mammoth.",
//           "images": [
//               {
//                   "credit": "NPS Photo",
//                   "altText": "A ranger explains the cave to visitors in the vast expanse of the passage called Broadway.",
//                   "title": "Broadway in Mammoth Cave",
//                   "id": 4571,
//                   "caption": "A ranger explains Mammoth Cave in the vast passage known as Broadway. Rotunda, one of the cave's largest rooms, is just ahead.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/6FE16EEF-1DD8-B71B-0BA9538F9BF50B2F.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "Dripstone formations create a panoply of textures in the Frozen Niagara section of Mammoth Cave",
//                   "title": "Mammoth Cave - Dripstone Wall",
//                   "id": 4572,
//                   "caption": "Dripstone formations create a panoply of textures in the Frozen Niagara section of Mammoth Cave as slowly dripping water redeposits dissolved limestone over the course of centuries. Image is a panoramic composite.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/700F5F4C-1DD8-B71B-0BEB7EF216AFBE1D.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "A girl peers wonderingly into the shadows of Mammoth Cave.",
//                   "title": "Wonder in Mammoth Cave",
//                   "id": 4573,
//                   "caption": "Mammoth Cave's shadows have beckoned the explorer deep within its visitors for geneerations, asking the question \"Where does that lead? What lies in the dark places?\" The questions remain as compelling today as they did for the first explorers.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/7023B352-1DD8-B71B-0B2FCCEA04639744.jpg"
//               },
//               {
//                   "credit": "NPS Photo/Tres Seymour",
//                   "altText": "A kayaker paddles up the languid waters of the Green River in Mammoth Cave National Park.",
//                   "title": "Green River in Mammoth Cave National Park",
//                   "id": 4574,
//                   "caption": "More than 30 miles of the Green and Nolin Rivers course through Mammoth Cave NP, representing one of the most biologically diverse river systems in the Eastern United States. Their languid waters are a magnet for canoeist, kayakers and anglers.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/703C9789-1DD8-B71B-0B835EDD04EB080E.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "A layer of fog hangs over a small group gathered to enter Mammoth Cave on a summer day.",
//                   "title": "Fog at Mammoth Cave Entrance",
//                   "id": 4575,
//                   "caption": "A layer of mist hangs over a small tour group gathered at the Historic Entrance of Mammoth Cave on a summer day - it both delights the skin and fogs spectacles, and gives a sense that one is on the threshold of another world.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/70A30ACF-1DD8-B71B-0B15BF86F0757385.jpg"
//               },
//               {
//                   "credit": "NPS Photo/Frances Benjamin Johnston",
//                   "altText": "Frances Benjamin Johnston and her photographic expedition enter Mammoth Cave in 1892.",
//                   "title": "Frances Benjamin Johnston Enters Mammoth Cave in 1892",
//                   "id": 4576,
//                   "caption": "Frances Benjamin Johnston and her photographic expedition enter the Historic Entrance of Mammoth Cave, 1892.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/70D86A2D-1DD8-B71B-0BD91E555B06AD37.jpg"
//               }
//           ],
//           "designation": "National Park",
//           "parkCode": "maca",
//           "id": "6A1737A1-6848-4087-AAF7-68A427247357",
//           "fullName": "Mammoth Cave National Park"
//       },
//       {
//           "states": "SD,NE",
//           "directionsInfo": "The National Park Service headquarters is located at 508 East Second Street in Yankton, South Dakota.",
//           "directionsUrl": "http://www.nps.gov/mnrr/planyourvisit/directions.htm",
//           "url": "https://www.nps.gov/mnrr/index.htm",
//           "weatherInfo": "Rapid weather changes are common along the Missouri National Recreational River corridor. Variations from season to season and from year to year are great. Characteristics of the climate are hot summers and cold winters. Sunshine is abundant, particularly in the summer months. Average annual rainfall is 25 inches. Thunderstorms can be dangerous and visitors should be prepared for them, especially from June until late August. Winter snowfall averages 34 inches annually.",
//           "name": "Missouri",
//           "latLong": "lat:42.7882189, long:-97.59077822",
//           "description": "Imagine a 100-mile stretch of North America's longest river, a vestige of the untamed American West. The Missouri National Recreational River is where imagination meets reality. Two free flowing stretches of the Missouri make up the National Park. Relive the past by making an exploration of the wild, untamed and mighty river that continues to flow as nature intended.",
//           "images": [
//               {
//                   "credit": "NPS Photo",
//                   "altText": "Aerial view of the Missouri River and surrounding landscape.",
//                   "title": "Aerial of Missouri River",
//                   "id": 3779,
//                   "caption": "Aerial view of the Missouri River and surrounding landscape.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C8375D2-1DD8-B71B-0B28DF0D3992CFAE.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "Sunken remains of the North Alabama steamboat appears only when water is low.",
//                   "title": "Remains of a sunken steamboat in Missouri River.",
//                   "id": 3780,
//                   "caption": "Sunken remains of the North Alabama steamboat appears only when water is low.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C8377AB-1DD8-B71B-0B6C5CE67B33725D.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "Scenic view of Missouri River on a sunny day",
//                   "title": "View of Missouri River",
//                   "id": 3781,
//                   "caption": "Scenic view of Missouri River on a sunny day",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C83791A-1DD8-B71B-0B9235DF1A05A7B4.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "Park educational trailer",
//                   "title": "Park trailer",
//                   "id": 3782,
//                   "caption": "Educational trailer with painted pictures",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C837A4B-1DD8-B71B-0BD5921C754C72FF.jpg"
//               }
//           ],
//           "designation": "National Recreational River",
//           "parkCode": "mnrr",
//           "id": "D43C7439-5C0B-4F4F-9D5B-65080F13AD28",
//           "fullName": "Missouri National Recreational River"
//       },
//       {
//           "states": "WA",
//           "directionsInfo": "Mount Rainier National Park is located in west-central Washington state. Several major cities in Washington- Seattle, Tacoma, and Yakima- and Portland, Oregon, are within 200 miles of the park. For GPS to Nisqually Entrance use: 39000 State Route 706 E, Ashford, WA 98304.",
//           "directionsUrl": "http://www.nps.gov/mora/planyourvisit/directions.htm",
//           "url": "https://www.nps.gov/mora/index.htm",
//           "weatherInfo": "Weather patterns at Mount Rainier are strongly influenced by the Pacific Ocean and elevation. The climate is generally cool and rainy, with summer highs in the 60s and 70s. While July and August are the sunniest months of the year, rain is very likely in spring, fall, and winter. Visitors should be aware that mountain weather is very changeable. In the higher elevations, like Paradise, winter can last from November to May with many feet of snow on the ground.",
//           "name": "Mount Rainier",
//           "latLong": "lat:46.86075416, long:-121.7043885",
//           "description": "Ascending to 14,410 feet above sea level, Mount Rainier stands as an icon in the Washington landscape. An active volcano, Mount Rainier is the most glaciated peak in the contiguous U.S.A., spawning five major rivers. Subalpine wildflower meadows ring the icy volcano while ancient forest cloaks Mount Rainier’s lower slopes. Wildlife abounds in the park’s ecosystems. A lifetime of discovery awaits.",
//           "images": [
//               {
//                   "credit": "NPS Photo / Emily Brouwer",
//                   "altText": "Sunset paints the glaciers of Mount Rainier in pink and gold.",
//                   "title": "Mount Rainier at sunset",
//                   "id": 1655,
//                   "caption": "Every scenic overlook shows a different side of Mount Rainier. Viewed from Gobblers Knob Lookout at sunset, the glaciers covering the mountain turn pink and gold.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7C68E6-1DD8-B71B-0B42E9A3C7ECA52D.jpg"
//               },
//               {
//                   "credit": "NPS Photo/ K. Loving",
//                   "altText": "Purple lupine and white bistort bloom in a meadow alongside a sign for the Wonderland Trail.",
//                   "title": "Wildflower Meadow Along the Wonderland Trail",
//                   "id": 1656,
//                   "caption": "Both the Wonderland Trail and subalpine meadows encircle Mount Rainier. Summertime blooms splatter the hillsides with color.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7C6A93-1DD8-B71B-0BA75B16C5FA3690.jpeg"
//               },
//               {
//                   "credit": "NPS Photo / Emily Brouwer",
//                   "altText": "Towering cedars and douglas-firs reach skyward while a beam of sun breaks through the canopy.",
//                   "title": "Giants of the Old-Growth Forest",
//                   "id": 1657,
//                   "caption": "With some of the few remaining old-growth forests in the Cascade Mountains, Mount Rainier National Park protects native plants great and small in places like the Grove of the Patriarchs.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7C6C47-1DD8-B71B-0BFF9108D08A7FD3.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "A hoary marmot with white frosted fur rests on a rock beside white flowers in a meadow.",
//                   "title": "Marmot in Morning Dew",
//                   "id": 1658,
//                   "caption": "From small amphibians and hoary marmots to the black bears and elk, many animals call the wild places of Mount Rainier home.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7C6D8C-1DD8-B71B-0BA69E7F583E25A5.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "The historic National Park Inn covered in a foot of snow.",
//                   "title": "National Park Inn in Winter",
//                   "id": 1659,
//                   "caption": "For thousands of years, people have traveled up to, over, and around Mount Rainier. Today the park strives to preserve this history while providing a chance for new generations to find their own adventures.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7C6EE9-1DD8-B71B-0B62C52C6844CC70.jpg"
//               },
//               {
//                   "credit": "NPS Photo / Steve Redman",
//                   "altText": "Two children hike on trail through wildflower meadow with Mount Rainier above them.",
//                   "title": "Kids Hiking Through Wildflower Meadow",
//                   "id": 1747,
//                   "caption": "Enjoying the outdoors through recreation is a big part of many visitors' experiences.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7CECB5-1DD8-B71B-0B54548D95910CF4.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "Climber on glacier steps downward with icy crags in background.",
//                   "title": "Climbing Mount Rainier",
//                   "id": 1748,
//                   "caption": "Summiting Mount Rainier involves climbing a volcano, scaling glaciers, dealing with high elevations and much more. Almost 10,000 people a year attempt to summit.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7CEEF2-1DD8-B71B-0B9F3B666327E5D1.jpg"
//               }
//           ],
//           "designation": "National Park",
//           "parkCode": "mora",
//           "id": "07229CB8-8533-4669-B614-2B884779DD93",
//           "fullName": "Mount Rainier National Park"
//       },
//       {
//           "states": "NY",
//           "directionsInfo": "See the websites for each of the ten national parks in New York Harbor for directions. To get to our offices at Federal Hall National Memorial: the main entrance of Federal Hall is located at 26 Wall Street, near the corner of Wall Street and Nassau Street. The rear entrance, which is wheelchair accessible, is located at 15 Pine Street, near the intersection of Pine Street and Nassau Street. It is highly recommended that all visitors use mass transit when traveling to Federal Hall.",
//           "directionsUrl": "http://www.nps.gov/feha/planyourvisit/directions.htm",
//           "url": "https://www.nps.gov/npnh/index.htm",
//           "weatherInfo": "Look up weather for New York City for most of the national parks in New York Harbor:\nhttp://forecast.weather.gov/MapClick.php?lat=40.7142&lon=-74.0059#.VqfYL_krKUk. Gateway National Recreation Area's Sandy Hook Unit in central New Jersey  can be found here: http://forecast.weather.gov/MapClick.php?lat=40.7142&lon=-74.0059#.VqfYL_krKUk.",
//           "name": "National Parks of New York Harbor",
//           "latLong": "lat:-74.0451049804688, long:40.6631915953388",
//           "description": "National Parks in New York City? Yes! There are 11 parks with a total of 23 different sites you can visit in all five boroughs and parts of New Jersey.\n\nCheck them out below.",
//           "images": [
//               {
//                   "credit": "NPS photo",
//                   "altText": "Manhattan skyline as seen from Governors Island National Monument",
//                   "title": "Manhattan skyline as seen from Governors Island National Monument",
//                   "id": 4067,
//                   "caption": "National Parks of New York Harbor includes ten national parks, including six within Manhattan alone.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C851C36-1DD8-B71B-0B0CDC66CCAD1F18.jpg"
//               },
//               {
//                   "credit": "NPS photo",
//                   "altText": "General Grant National Memorial at dusk in midwinter",
//                   "title": "General Grant National Memorial at dusk in midwinter",
//                   "id": 4069,
//                   "caption": "The largest mausoleum in North America pays tribute to Civil War general and U.S. President Ulysses S. Grant, who is entombed here with his wife Julia.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C851FAA-1DD8-B71B-0BB559E3777D5603.jpg"
//               },
//               {
//                   "credit": "NPS photo",
//                   "altText": "Battery Weed, Fort Wadsworth, Staten Island",
//                   "title": "Battery Weed, Fort Wadsworth, Staten Island",
//                   "id": 4071,
//                   "caption": "Gateway National Recreation Area covers two states and three New York City boroughs. Several of its sites are former military bases, such as Fort Wadsworth.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C8522DA-1DD8-B71B-0B633AD197DD157A.jpg"
//               },
//               {
//                   "credit": "NPS photo",
//                   "altText": "Statue of Liberty looking ahead",
//                   "title": "Statue of Liberty looking ahead",
//                   "id": 4072,
//                   "caption": "Statue of Liberty National Monument also includes Ellis Island Immigration Museum.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C85246C-1DD8-B71B-0B4219F690AD949E.jpg"
//               },
//               {
//                   "credit": "NPS photo",
//                   "altText": "African Burial Ground National Monument",
//                   "title": "African Burial Ground National Monument",
//                   "id": 4074,
//                   "caption": "A vast cemetery for enslaved and free Africans, forgotten since the 1790s, was rediscovered in 1991.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C8527D9-1DD8-B71B-0B9734907AE388BC.jpg"
//               }
//           ],
//           "designation": "",
//           "parkCode": "npnh",
//           "id": "186BF51D-FA34-4DD7-A967-233CB32547B8",
//           "fullName": "National Parks of New York Harbor"
//       },
//       {
//           "states": "LA",
//           "directionsInfo": "The park's main visitor center is in New Orleans' French Quarter, near the Mississippi River levee on North Peters Street between Dumaine Street and St. Phillip Street. A second visitor center is located in the New Orleans Jazz Museum at 400 Esplanade Avenue.",
//           "directionsUrl": "http://www.nps.gov/jazz/planyourvisit/directions.htm",
//           "url": "https://www.nps.gov/jazz/index.htm",
//           "weatherInfo": "All temperatures in degrees Fahrenheit. Note that relative humidity, especially in summer months, can reach 90%, so temperatures can feel 10-20 degrees hotter than actual temperature.\nSpring (March, April, May) average high 77, low 61\nSummer (June, July, August) average high 89, low 75\nFall (September, October, November) average high 78, low 64\nWinter (December, January, February) average high 64, low 48",
//           "name": "New Orleans Jazz",
//           "latLong": "lat:29.96303129, long:-90.06749669",
//           "description": "Only in New Orleans could there be a National Park for jazz! Drop by our visitor center at the New Orleans Jazz Museum at 400 Esplanade Ave. or 916 North Peters St. to inquire about musical events around town. In the mood for a world class musical experience? Attend a jazz concert or ranger performance at the new state of the art performance venue on the 3rd floor of the New Orleans Jazz Museum.",
//           "images": [
//               {
//                   "credit": "NPS Photo",
//                   "altText": "Exhibit titled \"What Is New Orleans Jazz?\"",
//                   "title": "Visitor Center Exhibit at New Orleans Jazz National Historical Park",
//                   "id": 4502,
//                   "caption": "\"What is New Orleans Jazz?\" A visit to the park's main visitor center at 916 North Peters Street will answer the question.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C87BF6D-1DD8-B71B-0BE7901DF3FCBDE9.jpg"
//               },
//               {
//                   "credit": "NPS Photo / Elizabeth Dupree",
//                   "altText": "Kids and adults playing instruments on a stage",
//                   "title": "Visitor Center Concert at New Orleans Jazz National Historical Park",
//                   "id": 4503,
//                   "caption": "Passing jazz traditions from one generation to the next is an important part of the park's mission---and great listening too!",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C87C0C3-1DD8-B71B-0BEF50BA9C9BFB5D.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "Singer with jazz band, including park rangers",
//                   "title": "US Mint Concert by New Orleans Jazz National Historical Park",
//                   "id": 4504,
//                   "caption": "The park's state-of-the-art concert space at the Old US Mint is the perfect place to enjoy some jazz.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C87C20C-1DD8-B71B-0B53480C74A5F56F.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "Rangers and others sing and play on a stage",
//                   "title": "US Mint Voting Rights Act Program at New Orleans Jazz National Historical Park",
//                   "id": 4505,
//                   "caption": "Programs like this celebration of the Voting Rights Act bring together history, culture, and music.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C87C3B6-1DD8-B71B-0B91F46410CC1CB1.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "A young brass band musician plays a trumpet",
//                   "title": "Community Events by New Orleans Jazz National Historical Park",
//                   "id": 4506,
//                   "caption": "The park works with local partners to share jazz at community events, festivals, and other venues.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C87C505-1DD8-B71B-0BE34A8A361477FB.jpg"
//               }
//           ],
//           "designation": "National Historical Park",
//           "parkCode": "jazz",
//           "id": "CB014DE3-3483-4E36-BC35-3CC7E9F60529",
//           "fullName": "New Orleans Jazz National Historical Park"
//       },
//       {
//           "states": "MO",
//           "directionsInfo": "The Headquarters for Ozark National Scenic Riverways is located at 404 Watercress Drive in Van Buren, Missouri.  It's located at the corner of Watercress Drive and Main Street, across the street from the Van Buren Public School complex.",
//           "directionsUrl": "http://www.nps.gov/ozar/planyourvisit/directions.htm",
//           "url": "https://www.nps.gov/ozar/index.htm",
//           "weatherInfo": "Ozark National Scenic Riverways is located in southeastern Missouri.  Summer temperatures generally range from 75-100 degrees with high humidity.  Winter temperatures generally range from 0-50 degrees with periods of intermittent freezing and snow.",
//           "name": "Ozark",
//           "latLong": "lat:37.13968894, long:-91.25709817",
//           "description": "Ozark National Scenic Riverways is the first national park area to protect a river system. The Current and Jacks Fork Rivers are two of the finest floating rivers you'll find anywhere. Spring-fed, cold and clear they are a delight to canoe, swim, boat or fish. Besides these two famous rivers, the park is home to hundreds of freshwater springs, caves, trails and historic sites such as Alley Mill.",
//           "images": [
//               {
//                   "credit": "NPS/Bill O'Donnell",
//                   "altText": "Alley Spring in the winter.",
//                   "title": "Alley Spring in the winter",
//                   "id": 3426,
//                   "caption": "Alley Spring Roller Mill is a popular destination year round.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C8186A2-1DD8-B71B-0B5649945E1AD39C.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "Big Spring near Van Buren, Missouri",
//                   "title": "Big Spring",
//                   "id": 3427,
//                   "caption": "Big Spring produces more than 250 million gallons of water per day.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C81882B-1DD8-B71B-0BB6270ECBB772DC.jpg"
//               },
//               {
//                   "credit": "NPS Photo/JoAnn Miller",
//                   "altText": "Prairie Hollow Gorge",
//                   "title": "Prairie Hollow Gorge",
//                   "id": 3428,
//                   "caption": "Prairie Hollow Gorge is located near the Two Rivers junction, off State Route V.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C818988-1DD8-B71B-0BF4BE0D63DA6DF9.jpg"
//               },
//               {
//                   "credit": "NPS Photo/JoAnn Miller",
//                   "altText": "Current River near Pulltite",
//                   "title": "Current River near Pulltite",
//                   "id": 3429,
//                   "caption": "The clear water of the Current River is perfect for floating.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C818ACD-1DD8-B71B-0B91F9B923E1E7A7.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "Rocky Falls",
//                   "title": "Rocky Falls",
//                   "id": 3430,
//                   "caption": "Rocky Falls is a popular picnic area and swimming hole located near the center of Ozark National Scenic Riverways.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C818C34-1DD8-B71B-0B06A21719A1D697.jpg"
//               },
//               {
//                   "credit": "NPS Photo/Bill O'Donnell",
//                   "altText": "Round Spring",
//                   "title": "Round Spring",
//                   "id": 3431,
//                   "caption": "Round Spring maintains a deep blue hue, like many of the other Ozark springs.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C818D8D-1DD8-B71B-0B9CB97DB6FC8FE6.jpg"
//               }
//           ],
//           "designation": "National Scenic Riverways",
//           "parkCode": "ozar",
//           "id": "CEC2A157-CDDC-4F11-BBE5-0AA2CEA35ADB",
//           "fullName": "Ozark National Scenic Riverways"
//       },
//       {
//           "states": "AZ",
//           "directionsInfo": "Petrified Forest stretches north and south between I-40 and Highway 180. Westbound I-40 travelers should take Exit 311, drive the 28 miles through the park and connect with Hwy 180 at the south end. Travel 19 miles on Hwy 180 North to return to Interstate 40 via Holbrook. Eastbound I-40 travelers should take Exit 285 into Holbrook then travel 19 miles on Hwy 180 South to the park's south entrance. Drive the 28 miles north through the park to return to I-40.",
//           "directionsUrl": "http://www.nps.gov/pefo/planyourvisit/directions.htm",
//           "url": "https://www.nps.gov/pefo/index.htm",
//           "weatherInfo": "Petrified Forest National Park is a semi-arid grassland. Temperatures range from above 100° F (38° C) to well below freezing. About 10 inches (25.4 cm) of moisture comes during infrequent snow in the winter and often dramatic summer thunder-storms. Animals and plants are adapted to extremes in temperature and moisture. You should be ready too. Check out the forecast before you arrive and plan accordingly.",
//           "name": "Petrified Forest",
//           "latLong": "lat:34.98387664, long:-109.7877678",
//           "description": "Did you know that Petrified Forest is more spectacular than ever? While the park has all the wonders known for a century, there are many new adventures and discoveries to share. There are backcountry hikes into areas never open before such as Red Basin and little known areas like the Martha's Butte. There are new exhibits that bring the stories to life. Come rediscover Petrified Forest!",
//           "images": [
//               {
//                   "credit": "NPS Photo",
//                   "altText": "Sunlit Painted Desert hills of the Petrified Forest National Wilderness Area",
//                   "title": "Petrified Forest National Wilderness Area",
//                   "id": 1836,
//                   "caption": "Sunrise and sunset are favorite times to view the colorful Painted Desert of the Petrified Forest National Wilderness Area",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7D8213-1DD8-B71B-0BE4A3B9394FD89A.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "Sunset lights up the Painted Desert Inn National Historic Landmark west side.",
//                   "title": "Painted Desert Inn National Historic Landmark",
//                   "id": 1837,
//                   "caption": "Sunset lights up the Painted Desert Inn National Historic Landmark west side.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7D83C9-1DD8-B71B-0B294D0F9ABC4B94.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "Sunlight highlights the colorful petrified wood of Agate House",
//                   "title": "Agate House",
//                   "id": 1838,
//                   "caption": "Agate House was built over 900 years ago out of pieces of petrified wood",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7D8582-1DD8-B71B-0BCCD89452609E15.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "Eroded towers called hoodoos loom above Devil's Playground.",
//                   "title": "Devil's Playground",
//                   "id": 4174,
//                   "caption": "Eroded towers called hoodoos loom above Devil's Playground.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C85AF53-1DD8-B71B-0BEF5C1DCFA2038C.jpg"
//               },
//               {
//                   "credit": "NPS Photo/Andrew V. Kearns",
//                   "altText": "Masonry wall foundations are all that are left of a hundred room pueblo",
//                   "title": "Puerco Pueblo",
//                   "id": 4175,
//                   "caption": "Masonry wall remnants are all that are left of a hundred room pueblo.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C85B076-1DD8-B71B-0BE0B8C88713C5B1.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "Painted Desert Community Complex Plaza reveals the long lines of Mid-century style architecture",
//                   "title": "Painted Desert Community Complex Plaza",
//                   "id": 4176,
//                   "caption": "Painted Desert Community Complex Plaza reveals the long lines of Mid-century style architecture",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C85B204-1DD8-B71B-0BC9467E64143CF7.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "A large petrified log stretches across a gully",
//                   "title": "Agate Bridge",
//                   "id": 4177,
//                   "caption": "This large petrified log stretches across a gully created by erosion.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C85B311-1DD8-B71B-0B66904CAD8F3429.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "Summer storm clouds build behind the banded badlands of Blue Mesa",
//                   "title": "Blue Mesa",
//                   "id": 4178,
//                   "caption": "Summer storm clouds build behind the banded badlands of Blue Mesa.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C85B432-1DD8-B71B-0B6CAB3EAEB4B185.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "Two visitors walk the Blue Mesa Trail between blue, purple, and grey badlands.",
//                   "title": "Blue Mesa Trail",
//                   "id": 4179,
//                   "caption": "Visitors enjoy the otherworldly walk along the Blue Mesa.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C85B554-1DD8-B71B-0BA79402AD7E7711.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "Many petrified logs are scattered in front of the blue grey badlands at Crystal Forest.",
//                   "title": "Crystal Forest",
//                   "id": 4180,
//                   "caption": "Many petrified logs are scattered among the badlands at Crystal Forest.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C85B660-1DD8-B71B-0B7B3DE8EF746997.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "A full rainbow arches over the open grassland.",
//                   "title": "Grassland Rainbow",
//                   "id": 4181,
//                   "caption": "A full rainbow arches over the open grassland.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C85B78F-1DD8-B71B-0B45AC003E5EADA5.jpg"
//               },
//               {
//                   "credit": "NPS Photo/Andrew V. Kearns",
//                   "altText": "Swirly patterned rocks form a jumbled puzzle in front of red badlands",
//                   "title": "Expansion Land Scenery",
//                   "id": 4182,
//                   "caption": "Swirly patterned rocks form a jumbled puzzle in front of red badlands in the expansion lands.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C85BA2E-1DD8-B71B-0BCC7E46CF3A5E54.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "Mesas glow red at dawn",
//                   "title": "Flattops",
//                   "id": 4183,
//                   "caption": "The Flattops glow red at dawn.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C85BB38-1DD8-B71B-0B42EE9151DD2175.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "Handpainted glass skylight at the historic",
//                   "title": "Painted Desert Inn CCC Lyle Bennett Skylight Montage",
//                   "id": 4184,
//                   "caption": "Handpainted skylight panels by the CCC  designed by architect Lyle Bennett grace the historic Painted Desert Inn NHL",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C85BC99-1DD8-B71B-0B8A5ACCF9B0EC09.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "Many Hopi symbols are represented in this mural including eagles, corn, and rain.",
//                   "title": "Fred Kabotie Mural at the Painted Desert Inn National Historic Landmark",
//                   "id": 4185,
//                   "caption": "Many Hopi symbols are featured in this Fred Kabotie mural at the Painted Desert Inn National Historic Landmark",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C85BE11-1DD8-B71B-0BFF717908941A06.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "a long petrified log stretches across a wash",
//                   "title": "Onyx Bridge, Petrified Forest National Wilderness Area",
//                   "id": 4186,
//                   "caption": "Onyx Bridge is a popular destination for hikers in the Petrified Forest National Wilderness Area's north unit.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C85BF65-1DD8-B71B-0BE4289889EAD5F6.jpg"
//               },
//               {
//                   "credit": "NPS Photo/Andrew V. Kearns",
//                   "altText": "many petrified logs lay on the ground and on eroded pedestals of clay",
//                   "title": "Jasper Forest",
//                   "id": 4187,
//                   "caption": "Jasper Forest has some of the most colorful logs in the park.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C85C078-1DD8-B71B-0BD76F126AAEA9B3.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "An old 1932 Studebaker auto sits near the Route 66 alignment",
//                   "title": "Route 66 Alignment",
//                   "id": 4188,
//                   "caption": "An old 1932 Studebaker auto sits near the Route 66 alignment.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C85C190-1DD8-B71B-0B5317830C7F09DE.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "handmade Spanish colonial style punched tin light fixtures were made by the CCC",
//                   "title": "Painted Desert Inn Punched Tin Light Fixtur",
//                   "id": 4189,
//                   "caption": "The handmade Spanish-colonial-style punched tin light fixtures were made by the CCC in the 1930s for the Painted Desert Inn NHL.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C85C2AA-1DD8-B71B-0BF5792781E5B474.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "A beam of light touches a petroglyph at Puerco Pueblo on the summer solstice",
//                   "title": "Summer Solstice Petroglyph at Puerco Pueblo",
//                   "id": 4190,
//                   "caption": "A petroglyph at Puerco Pueblo interacts with the sunlight on the summer solstice.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C85C3CB-1DD8-B71B-0B296F95FC7E1D8C.jpg"
//               },
//               {
//                   "credit": "NPS Photo/Stuart Holmes",
//                   "altText": "a petroglyph pecked into sandstone that represents a mountain lion",
//                   "title": "Mountain Lion Petroglyph",
//                   "id": 4191,
//                   "caption": "This ancient petroglyph of a mountain lion has become an icon of the park.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C85C4E0-1DD8-B71B-0B7C5271FF8EF1B7.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "Researchers dig for fossils in the badlands",
//                   "title": "Paleontological Excavation",
//                   "id": 4192,
//                   "caption": "Researchers dig for fossils in the badlands.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C85C6E5-1DD8-B71B-0BC4D0A3D39A6DE2.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "yellow and other colors in a piece of brightly colored petrified wood",
//                   "title": "Colorful Piece of Petrified Wood",
//                   "id": 4193,
//                   "caption": "Iron oxide is one of the many trace minerals that create the color of petrified wood.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C85CBE9-1DD8-B71B-0B8A5549DD3F55D1.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "striped badlands glow red in the sunset light at the Tepees",
//                   "title": "Sunset on the Tepees",
//                   "id": 4194,
//                   "caption": "Striped badlands glow red in the sunset light at the Tepees.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C85CD2A-1DD8-B71B-0B4D05CE130B763B.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "Kids excavating in the field with Park Paleontologist Bill Parker",
//                   "title": "Kids Day Camp Field Trip with Park Paleontologist Bill Parker",
//                   "id": 4195,
//                   "caption": "Kids excavating in the field with Park Paleontologist Bill Parker",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C85CE61-1DD8-B71B-0B9F5602A4737BCA.jpg"
//               },
//               {
//                   "credit": "NPS/Jacob Holgerson",
//                   "altText": "Dark blue sky filled with stars over banded badland.",
//                   "title": "Milky Way Over Blue Mesa",
//                   "id": 12077,
//                   "caption": "Petrified Forest is now an International Dark Sky Park!",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/044BA1B8-1DD8-B71B-0BDCE568A7F4FC60.jpg"
//               }
//           ],
//           "designation": "National Park",
//           "parkCode": "pefo",
//           "id": "1ABD0EFF-AC09-4EA1-8CC1-2351A3E160D0",
//           "fullName": "Petrified Forest National Park"
//       },
//       {
//           "states": "CA",
//           "directionsInfo": "Redwood National and State Parks is located in northernmost coastal California - almost on the Oregon border. The parks are about 60-miles long, with four visitor centers from north to south.\n\nWe are a six to seven-hour drive (325 miles) north of San Francisco, a six-hour drive (330 miles) south of Portland, OR and a four-hour drive (170 miles) west of Redding, CA.",
//           "directionsUrl": "http://www.nps.gov/redw/planyourvisit/directions.htm",
//           "url": "https://www.nps.gov/redw/index.htm",
//           "weatherInfo": "Visitors should be prepared for cooler and damp weather. Dress in layers and expect to get wet.\nYear-round temperatures along California's redwood coast: mid-40s°F (7°C) to mid-60s°F (18°C). \n\nSummer can be foggy, with highs occasionally reaching low 70s°F (20°C). \nWinters are cooler with considerable rain. October through April averages 60-80 inches of rain over the region.",
//           "name": "Redwood",
//           "latLong": "lat:41.37237268, long:-124.0318129",
//           "description": "Most people know Redwood as home to the tallest trees on Earth. The parks also protect vast prairies, oak woodlands, wild river-ways, and nearly 40-miles of rugged coastline.  For thousands of years people have lived in this verdant landscape.  Together, the National Park Service and California State Parks are managing and restoring these lands for the inspiration, enjoyment, and education of all.",
//           "images": [
//               {
//                   "credit": "NPS Photo / John Chao",
//                   "altText": "Redwood tree bark and canopy",
//                   "title": "Redwood tree at Stout Grove",
//                   "id": 7803,
//                   "caption": "",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/13B07C75-1DD8-B71B-0BD552B11A6CA62A.jpg"
//               },
//               {
//                   "credit": "NPS Photo / John Chao",
//                   "altText": "Two visitors looking at tidepools.",
//                   "title": "Tide pooling at Enderts Beach",
//                   "id": 7804,
//                   "caption": "",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/13C2D9FD-1DD8-B71B-0B3C56643E2A396D.jpg"
//               },
//               {
//                   "credit": "NPS Photo / John Chao",
//                   "altText": "Visitors chatting with a ranger above a river mouth.",
//                   "title": "Ranger Program at Klamath River Overlook",
//                   "id": 7805,
//                   "caption": "Coastal overlooks provide amazing places to whale watch.. and more.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/13E30047-1DD8-B71B-0B03D2E0CECCE8AD.jpg"
//               },
//               {
//                   "credit": "",
//                   "altText": "Redwood trees line a narrow dirt road.",
//                   "title": "Howland Hill Road",
//                   "id": 7806,
//                   "caption": "With a small car, you can expericne close-up Redwoods along a century old, narrow road.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/13FB649C-1DD8-B71B-0B50D0E826025619.jpg"
//               },
//               {
//                   "credit": "NPS Photo / John Chao",
//                   "altText": "Visitors pose with one of the widest Redwood trees.",
//                   "title": "\"Big Tree\" wayside.",
//                   "id": 7807,
//                   "caption": "For those short of time, the \"Big Tree\" offers easy access for all to a very photogenic tree.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/1427B3E7-1DD8-B71B-0BFA87FE718FB3A6.jpg"
//               },
//               {
//                   "credit": "NPS photo / John Chao",
//                   "altText": "Crashing waves along the Redwood Coast.",
//                   "title": "Enderts Beach",
//                   "id": 7808,
//                   "caption": "Dramatic coastal scenery is a big part of the Redwood experience.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/144AF328-1DD8-B71B-0B3DB4A92C1B75F0.jpg"
//               },
//               {
//                   "credit": "NPS Photo / Shaina Niehans",
//                   "altText": "A walking trail surround by redwood trees and ferns.",
//                   "title": "A trail through the Redwoods",
//                   "id": 7814,
//                   "caption": "",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/519DB49A-1DD8-B71B-0B91252A6E6D2B43.jpg"
//               },
//               {
//                   "credit": "NPS: John Chao",
//                   "altText": "Rocks, rockpools and waves",
//                   "title": "Incoming Tide at  Redwood National Park",
//                   "id": 9023,
//                   "caption": "40 miles of coastline are part of Redwood National Park",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/6B306966-1DD8-B71B-0B36E955A7B3205F.jpg"
//               },
//               {
//                   "credit": "NPS: John Chao",
//                   "altText": "Five young women read the park map.",
//                   "title": "Visitors Plan Their Redwood Trip",
//                   "id": 9024,
//                   "caption": "A great redwood trip starts with good trip planning.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/6B440E44-1DD8-B71B-0B6E95D9C432231F.jpg"
//               },
//               {
//                   "credit": "NPS: John Chao",
//                   "altText": "A ranger helps a father and son learn about being a junior ranger.",
//                   "title": "A New Junior Ranger",
//                   "id": 9025,
//                   "caption": "Becming a junior ranger at Redwoods is fun and educational for the whole family.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/6B56ACA8-1DD8-B71B-0BB0C6228E534168.jpg"
//               }
//           ],
//           "designation": "National and State Parks",
//           "parkCode": "redw",
//           "id": "041B325C-A34F-4027-8E41-1DF3F9A1D799",
//           "fullName": "Redwood National and State Parks"
//       },
//       {
//           "states": "CO",
//           "directionsInfo": "Driving from the east: from I-25, take US Hwy 34 or 36. Driving from the west: from I-70, take US Hwy 40 to Granby to US Hwy 34 to Grand Lake. From mid-October until late May, Trail Ridge Road between Estes Park and Grand Lake is closed to vehicles, so driving between the two takes ~4 hours. The closest airport is Denver International (DIA). There is no public transportation between nearby cities and the park.",
//           "directionsUrl": "http://www.nps.gov/romo/planyourvisit/directions.htm",
//           "url": "https://www.nps.gov/romo/index.htm",
//           "weatherInfo": "Winter (Dec–Mar): cold weather, deep snow at higher elevations, and seasonal closures of facilities and roads. Spring (April–May): unpredictable weather, with a mix of warm sunny days and cool days with heavy snow and rain. Many trails are still snow-covered. Trail Ridge Road opens in late May. Summer (Jun–Aug): warmer weather, thunderstorms, and wildflowers. Most park roads and facilities are open. Fall (Sep–Nov): crisp air, blue skies, fall colors, and the elk rut. Trail Ridge Road closes mid-October.",
//           "name": "Rocky Mountain",
//           "latLong": "lat:40.3556924, long:-105.6972879",
//           "description": "Rocky Mountain National Park’s 415 square miles encompass and protect spectacular mountain environments. Enjoy Trail Ridge Road – which crests at over 12,000 feet including many overlooks to experience the subalpine and alpine worlds – along with over 300 miles of hiking trails, wildflowers, wildlife, starry nights, and fun times. In a world of superlatives, Rocky is on top!",
//           "images": [
//               {
//                   "credit": "NPS Photo",
//                   "altText": "Longs Peak, covered in snow, against dark moody clouds.",
//                   "title": "Longs Peak",
//                   "id": 2966,
//                   "caption": "Longs Peak towers above Rocky Mountain National Park.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7ECB23-1DD8-B71B-0BC28A0330D6D8D6.png"
//               },
//               {
//                   "credit": "NPS Photo / Ann Schonlau",
//                   "altText": "Yellow flowers bloom on tundra slopes with mountains in the background.",
//                   "title": "Summer on the Tundra",
//                   "id": 2967,
//                   "caption": "Old Man of the Mountain bloom on Rocky's alpine tundra.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7ECCCF-1DD8-B71B-0B4CB4FB1834BC1D.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "Road sweeps across open tundra with mountains in background.",
//                   "title": "Trail Ridge Road",
//                   "id": 2968,
//                   "caption": "Trail Ridge Road, the highest continuous paved road in the United States, let's visitors experience Rocky's alpine tundra.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7ECE39-1DD8-B71B-0BAA393EB3C3A995.jpg"
//               },
//               {
//                   "credit": "NPS Photo / Ann Schonlau",
//                   "altText": "A herd of elk stand in a meadow.",
//                   "title": "Elk in Moraine Park",
//                   "id": 2969,
//                   "caption": "In the fall, Rocky's elk gather together in groups for the mating season.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7ECF9D-1DD8-B71B-0BDDCD1305CF6893.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "The moon sets below mountain peaks at sunrise.",
//                   "title": "Horseshoe Park",
//                   "id": 2970,
//                   "caption": "While the moon sets, the sun rises at Horseshoe Park, one of Rocky's beautiful meadows.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7ED106-1DD8-B71B-0B08F084FEA51AE0.jpg"
//               }
//           ],
//           "designation": "National Park",
//           "parkCode": "romo",
//           "id": "67A56B17-F533-4A56-B2DA-26091C6AD295",
//           "fullName": "Rocky Mountain National Park"
//       },
//       {
//           "states": "CA",
//           "directionsInfo": "Two highways enter the parks. Hwy 180 from Fresno leads east to Kings Canyon National Park, then continues 30 miles east to Cedar Grove. Hwy 198 from Visalia leads east to Sequoia National Park via Three Rivers. Inside the parks, Highway 198 becomes the Generals Highway, which connects 198 to 180. \n\nVehicles over 22-feet long should enter the parks via Highway 180.\n\nIn winter, the Generals Highway between the parks often closes. Chains may be required on park roads.\n\nNo roads cross these parks east to west.",
//           "directionsUrl": "http://www.nps.gov/seki/planyourvisit/directions.htm",
//           "url": "https://www.nps.gov/seki/index.htm",
//           "weatherInfo": "Because of the extreme elevation range in these parks, weather conditions vary widely between areas. \n\nIn summer, the sequoia groves have comfortable temperatures and the foothills are hot and dry. Snow lingers on high-mountain passes well into summer.\n\nIn fall, some areas close or reduce their hours. Winter brings snow to sequoia groves and rain to the foothills. Be prepared for tire chain requirements. \n\nSpring is a great time to hike in the foothills and snow begins to melt at higher elevations.",
//           "name": "Sequoia & Kings Canyon",
//           "latLong": "lat:36.71277299, long:-118.587429",
//           "description": "This dramatic landscape testifies to nature's size, beauty, and diversity--huge mountains, rugged foothills, deep canyons, vast caverns, and the world's largest trees. These two parks lie side by side in the southern Sierra Nevada east of the San Joaquin Valley. Weather varies a lot by season and elevation, which ranges from 1,370' to 14,494'.",
//           "images": [
//               {
//                   "credit": "NPS/Rick Cain",
//                   "altText": "A deep canyon with a forested floor and steep granite cliffs",
//                   "title": "Kings Canyon",
//                   "id": 290,
//                   "caption": "The Glaciers carved the Kings Canyon's steep granite cliffs, leaving a wide U-shaped valley.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7A250B-1DD8-B71B-0BCF61A89A8B2970.jpg"
//               },
//               {
//                   "credit": "NPS/Rick Cain",
//                   "altText": "A steep granite slope leads from forest to a bare alpine landscape",
//                   "title": "The Tablelands",
//                   "id": 292,
//                   "caption": "Just above Lodgepole Valley, the trail to the Watchtower offers views above the treeline.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7A2835-1DD8-B71B-0B468E834049FBE4.jpg"
//               },
//               {
//                   "credit": "NPS/Paul Johnson",
//                   "altText": "A guardrail encircles people along a narrow walkway with wide views",
//                   "title": "Moro Rock",
//                   "id": 294,
//                   "caption": "A historic stairway leads to the top of Moro Rock, offering views from foothills to peaks",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7A2E1B-1DD8-B71B-0B4D563CB47FA60F.jpg"
//               },
//               {
//                   "credit": "NPS",
//                   "altText": "A giant sequoia's reddish bark contrasts with the snow around it",
//                   "title": "Giant Sequoia in Winter",
//                   "id": 295,
//                   "caption": "For those who don't mind icy roads, winter offers stunning views of sequoias in snow.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7A301B-1DD8-B71B-0B8311F9B0AC4F69.jpg"
//               },
//               {
//                   "credit": "NPS/Rick Cain",
//                   "altText": "A rustic building is surrounded by giant sequoias",
//                   "title": "Giant Forest Museum",
//                   "id": 320,
//                   "caption": "Giant Forest Museum offers exhibits, park information, and a bookstore.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7A4E3C-1DD8-B71B-0B99ADC8D2689BDE.jpg"
//               }
//           ],
//           "designation": "National Parks",
//           "parkCode": "seki",
//           "id": "7E5A693C-2F63-44FD-B791-31FC8B8B6285",
//           "fullName": "Sequoia & Kings Canyon National Parks"
//       },
//       {
//           "states": "ND",
//           "directionsInfo": "Theodore Roosevelt National Park is located in the Badlands of western North Dakota. \nThere are three units to the park. The South Unit entrance is in the town of Medora, ND off of Interstate 94 exits 24 and 27. The North Unit entrance is on Highway 85 approximately 14 miles south of Watford City, ND. The remote Elkhorn Ranch Unit sits roughly in the middle of the North and South Units and is accessed via gravel roads. Consult park staff for directions to the Elkhorn Ranch Unit.",
//           "directionsUrl": "http://www.nps.gov/thro/planyourvisit/directions.htm",
//           "url": "https://www.nps.gov/thro/index.htm",
//           "weatherInfo": "In winter, some or all park roads may be closed due to snow.",
//           "name": "Theodore Roosevelt",
//           "latLong": "lat:47.17777274, long:-103.4300083",
//           "description": "When Theodore Roosevelt came to Dakota Territory to hunt bison in 1883, he was a skinny, young, spectacled dude from New York. He could not have imagined how his adventure in this remote and unfamiliar place would forever alter the course of the nation. The rugged landscape and strenuous life that TR experienced here would help shape a conservation policy that we still benefit from today.",
//           "images": [
//               {
//                   "credit": "NPS Photo / Laura Thomas",
//                   "altText": "the Little Missouri River under blue skies",
//                   "title": "A View from the Maah Daah Hey Trail",
//                   "id": 105,
//                   "caption": "The Maah Daah Hey Trail follows the Little Missouri River for several miles before it enters the Theodore Roosevelt Wilderness.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7939C8-1DD8-B71B-0B048D7EC3812DE3.jpg"
//               },
//               {
//                   "credit": "NPS Photo / Mark Meyers",
//                   "altText": "A colorfully striped butte in the foreground overlooks a dark green badlands landscape",
//                   "title": "River Bend Overlook, North Unit",
//                   "id": 106,
//                   "caption": "The River Bend Overlook offers one of the most popular views in the park's North Unit.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C793AD5-1DD8-B71B-0B4A3C1BFA5B4C83.jpg"
//               },
//               {
//                   "credit": "NPS Photo / Laura Thomas",
//                   "altText": "a green prairie hilltop overlooks the badlands, shrouded in shadows",
//                   "title": "Sunset on Buck Hill",
//                   "id": 107,
//                   "caption": "A short climb to the top of Buck Hill in the park's South Unit rewards hikers with a sweeping panorama and a fantastic place to watch the sun rise or set.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C793C29-1DD8-B71B-0BD780A3A72F020B.jpg"
//               },
//               {
//                   "credit": "NPS Photo / Laura Thomas",
//                   "altText": "A muddy river bank lined with cottonwood trees and steep buttes",
//                   "title": "Ekblom Trail",
//                   "id": 108,
//                   "caption": "The Ekblom Trail is the gateway to the Theodore Roosevelt Wilderness. All you have to do is make it across the river!",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C793D1D-1DD8-B71B-0B17AA76AF7AE453.jpg"
//               },
//               {
//                   "credit": "NPS Photo / Roland and Lisa Honeyman",
//                   "altText": "a string of bison are silhouetted against the backdrop of hazy blue and yellow badlands",
//                   "title": "Bison Trail",
//                   "id": 113,
//                   "caption": "Bison roam the badlands from top to bottom, surprising visitors with their agility and ability to cross even the most rugged terrain.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7941B3-1DD8-B71B-0B9F03744B164B38.jpg"
//               },
//               {
//                   "credit": "NPS Photo / Teresina Wheaten",
//                   "altText": "two bull bison collide heads in a dusty battle for dominance",
//                   "title": "Raise a Ruckus",
//                   "id": 114,
//                   "caption": "In the summer, bull bison wage furious battles over the right to breed.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C794347-1DD8-B71B-0B5EB10134348DE1.jpg"
//               },
//               {
//                   "credit": "NPS Photo / Rolan and Lisa Honeyman",
//                   "altText": "A bugling bull elk and his harem of cows stand on the edge of a butte as the sunlight fades",
//                   "title": "Fall Bugle",
//                   "id": 118,
//                   "caption": "The ghostly bugles of bull elk can be heard wafting through the badlands in the fall.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C79484D-1DD8-B71B-0BD76E098C35DBFA.jpg"
//               },
//               {
//                   "credit": "NPS Photo / Jeff Zylland",
//                   "altText": "the swirling, dusty looking milky way runs vertically though a starry night sky",
//                   "title": "Milky Way",
//                   "id": 120,
//                   "caption": "Though light pollution in the area is increasing, the night sky over Theodore Roosevelt National Park remains beautiful and inspiring.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C794A8F-1DD8-B71B-0B3C8A05CF065D02.jpg"
//               },
//               {
//                   "credit": "NPS Photo / Laura Thomas",
//                   "altText": "a strange looking sand and rock formation stands in a prairie of brown grass",
//                   "title": "Hoodoos",
//                   "id": 122,
//                   "caption": "Theodore Roosevelt described the badlands as \"so fantastically broken in form and so bizarre in color as to seem hardly properly to belong to this earth.\"",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C794D85-1DD8-B71B-0BE8C67C46D0233A.jpg"
//               },
//               {
//                   "credit": "NPS Photo",
//                   "altText": "The rising sun casts light on Roosevelt's snow-covered cabin.",
//                   "title": "Maltese Cross Cabin",
//                   "id": 123,
//                   "caption": "Imagine waking up on a crisp winter morning in Roosevelt's Maltese Cross Cabin. It is no wonder that his heart was captured by the romance of life in the West.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C795014-1DD8-B71B-0B9A2115735380B0.jpg"
//               }
//           ],
//           "designation": "National Park",
//           "parkCode": "thro",
//           "id": "B5FE5682-7981-47DD-AC96-13F4B33A466E",
//           "fullName": "Theodore Roosevelt National Park"
//       },
//       {
//           "states": "VI",
//           "directionsInfo": "There are no airports on St. John so you must fly to St. Thomas Cyril E. King Airport (code STT) and travel from there.\nFrom the airport you rent a car and drive or take a taxi to Redhook (west end) St. Thomas.\nFrom there you can either take a car barge to St. John or the people ferry.\nOnce on St. John you can easily walk from the ferry terminal to the Visitor Center.",
//           "directionsUrl": "http://www.nps.gov/viis/planyourvisit/directions.htm",
//           "url": "https://www.nps.gov/viis/index.htm",
//           "weatherInfo": "Mostly Perfect! The Tradewinds (the Easterlies) dominate the weather in the Virgin Islands, blowing east to west across the tropical Atlantic. The winter tends to bring stronger winds and less rain, and the summer tends to bring more rain and lighter winds.\n\nBe sure to check the forecast often during hurricane season or winter swell events.",
//           "name": "Virgin Islands",
//           "latLong": "lat:18.34279656, long:-64.74194451",
//           "description": "Virgin Islands National Park is more than just beautiful beaches. Hike to plantation ruins to learn about a time when sugar dominated the island. Visit the ancient petroglyphs carved by the Taino Indians. Come snorkel the coral reefs to discover hidden marine life.  Two-thirds of the island of St. John is national park, making it a unique destination for visitors from around the world.",
//           "images": [
//               {
//                   "credit": "Kimberly Boulon",
//                   "altText": "Cinnamon Bay Factory",
//                   "title": "Cinnamon Bay Factory",
//                   "id": 216,
//                   "caption": "Cinnamon Bay Factory reached by accessible trail.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C79CCA2-1DD8-B71B-0BB6BCFC19DE82D1.jpg"
//               },
//               {
//                   "credit": "NPS Photo/Christy McManus",
//                   "altText": "A Day at Maho Bay",
//                   "title": "A Day at Maho Bay",
//                   "id": 217,
//                   "caption": "A Day at Maho Bay",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C79CDD2-1DD8-B71B-0B0F3B5714173899.jpg"
//               },
//               {
//                   "credit": "Judy Bucholz",
//                   "altText": "Queen Angel Fish",
//                   "title": "Queen Angel Fish",
//                   "id": 218,
//                   "caption": "A Beautiful Queen Angel Fish",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C79CEF6-1DD8-B71B-0BE2B171E1C38905.jpg"
//               },
//               {
//                   "credit": "Caroline Rogers",
//                   "altText": "Four Stilts in the Francis Bay Pond",
//                   "title": "Four Stilts for the Bird Watchers",
//                   "id": 219,
//                   "caption": "Four Stilts in the Francis Bay Pond",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C79D033-1DD8-B71B-0B99DCE07EFF9D58.jpg"
//               },
//               {
//                   "credit": "Stephanie Guyer-Stevens",
//                   "altText": "A Sunset Paddle",
//                   "title": "Sunset Paddle",
//                   "id": 220,
//                   "caption": "A Sunset Paddle, a perfect end to your day.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C79D149-1DD8-B71B-0B90F4272FF2EB3F.jpg"
//               }
//           ],
//           "designation": "National Park",
//           "parkCode": "viis",
//           "id": "C65070FE-942C-4E00-8C2B-64CA33C85B4A",
//           "fullName": "Virgin Islands National Park"
//       },
//       {
//           "states": "VA",
//           "directionsInfo": "Wolf Trap National Park for the Performing Arts is located in Vienna, Virginia. The park can be accessed by traveling from Route 7, the Dulles Toll Road (Route 267), Beulah Road or Old Courthouse Road. For more detailed information visit the park's directions page.",
//           "directionsUrl": "http://www.nps.gov/wotr/planyourvisit/directions.htm",
//           "url": "https://www.nps.gov/wotr/index.htm",
//           "weatherInfo": "The weather at Wolf Trap National Park for the Performing Arts is typical for the mid-Atlantic area. There are four seasons. The majority of visitation is during the summers, which can be hot and humid during the day and cooler at night.",
//           "name": "Wolf Trap National Park for the Performing Arts",
//           "latLong": "lat:38.93854526, long:-77.265089",
//           "description": "No matter what your age or taste in shows, you'll find something you like onstage at Wolf Trap. From May through September, multiple amphitheaters in the park present performances such as musicals, dance, opera, jazz, and popular and country music.\n\nA good time to explore the beauty  and history of the park without the crowds is October - April.",
//           "images": [
//               {
//                   "credit": "NPS Photo / N. Adams",
//                   "altText": "The Filene Center House full of patrons",
//                   "title": "Filene Center Blast Off",
//                   "id": 3223,
//                   "caption": "Everyone is ready to kickoff the Filene Center season.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C8068F8-1DD8-B71B-0B3D0F4B88C2CD62.jpg"
//               },
//               {
//                   "credit": "NPS Photo / N. Adams",
//                   "altText": "Bust of Catherine Filene Shouse with building in back",
//                   "title": "Catherine Filene Shouse Bust",
//                   "id": 3224,
//                   "caption": "Catherine Filene Shouse donated her land to the National Park Service, which Wolf Trap National Park for the Performing Arts was established.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C806A78-1DD8-B71B-0B214F246D9BC413.jpg"
//               },
//               {
//                   "credit": "NPS Photo / N. Adams",
//                   "altText": "A ranger leads a program on a picnic table with kids and adults participating",
//                   "title": "Junior Ranger Day",
//                   "id": 3225,
//                   "caption": "Junior Ranger Days are scheduled throughout the summer.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C806BD6-1DD8-B71B-0B88EAC3A090E7BF.jpg"
//               },
//               {
//                   "credit": "NPS Photo / N. Adams",
//                   "altText": "Native garden with the Filene Center in the background",
//                   "title": "Dimple Meadow",
//                   "id": 3226,
//                   "caption": "In 2012, park staff and volunteers planted 42 species of native grasses and wildflowers here to create a habitat that now supports over 40 kinds of bees and 25 types of butterflies.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C806D30-1DD8-B71B-0B1348005ED7DA7D.jpg"
//               },
//               {
//                   "credit": "NPS Photo / N. Adams",
//                   "altText": "Filene Center in the background with autumn leaves",
//                   "title": "Natural Side of a Park for the Performing Arts",
//                   "id": 3227,
//                   "caption": "There are opportunities year-round to hike and enjoy the outdoors, picnic and participate in ranger programs or walks.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C806EB0-1DD8-B71B-0B61464724F6810A.jpg"
//               },
//               {
//                   "credit": "NPS Photo / N. Adams",
//                   "altText": "Sold out show at Theatre-in-the-Woods",
//                   "title": "Children's Theatre-in-the-Woods Performances",
//                   "id": 3229,
//                   "caption": "Most of the activities in the park during the summer are centered around performances at the Filene Center and Theatre-in-the-Woods.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C80727B-1DD8-B71B-0B7F94588A9BB608.jpg"
//               }
//           ],
//           "designation": "",
//           "parkCode": "wotr",
//           "id": "72F41D84-A8ED-47FC-935A-2FD28C3C582E",
//           "fullName": "Wolf Trap National Park for the Performing Arts"
//       },
//       {
//           "states": "AK",
//           "directionsInfo": "The administrative building and main park visitor center are located along the Richardson Highway (Hwy 4), which is a paved state highway that runs through Copper Center, AK. The buildings are 8 miles south of the Glenn Highway and Richardson Highway intersection near Glennallen, Alaska.  This is approximately 200 miles east of Anchorage, AK and 250 miles south of Fairbanks, AK.",
//           "directionsUrl": "http://www.nps.gov/wrst/planyourvisit/wrangell-st-elias-visitor-center.htm",
//           "url": "https://www.nps.gov/wrst/index.htm",
//           "weatherInfo": "Varies widely depending on location in park and time of year.  Visit http://www.nps.gov/wrst/planyourvisit/weather.htm for detailed information.",
//           "name": "Wrangell - St Elias",
//           "latLong": "lat:61.4182147, long:-142.6028439",
//           "description": "Wrangell St. Elias is a vast national park that rises from the ocean all the way up to 18,008 ft. At 13.2 million acres, the park is the same size as Yellowstone National Park, Yosemite National Park, and Switzerland combined! Within this wild landscape, people continue to live off the land as they have done for centuries. This rugged, beautiful land is filled with opportunities for adventure.",
//           "images": [
//               {
//                   "credit": "NPS Photo/ Bryan Petrtyl",
//                   "altText": "Two backpackers sitting in an alpine meadow with snowy mountains in the background",
//                   "title": "Backpackers in Mentasta Mountains",
//                   "id": 385,
//                   "caption": "Wrangell-St. Elias National Park is a backpacker's paradise.  A variety of routes take you into beautiful country, including the Mentasta Mountains.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7AAC04-1DD8-B71B-0B6534785C41D6B5.jpg"
//               },
//               {
//                   "credit": "NPS Photo/ Neal Herbert",
//                   "altText": "Glaciers loom over the ocean with large snowy mountains rising into blue skies",
//                   "title": "Icy Bay with Mt. St. Elias",
//                   "id": 386,
//                   "caption": "Wrangell-St. Elias National Park contains a diversity of natural features.  Landscapes unique to the North American continent are common here.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7AAD63-1DD8-B71B-0BCE10FFD741A687.jpg"
//               },
//               {
//                   "credit": "NPS Photo/ Matthew Yarbrough",
//                   "altText": "Historic, large, red buildings with mountains in the background",
//                   "title": "Kennecott Mill Town",
//                   "id": 388,
//                   "caption": "Kennecott Mines National Historic Landmark is found within Wrangell-St. Elias National Park.  This early 1900's copper mining operation overcame numerous challenges and found success in the heart of the Alaskan wilderness.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7AB124-1DD8-B71B-0B224A3B96A7304E.jpg"
//               },
//               {
//                   "credit": "NPS Photo/ Bryan Petrtyl",
//                   "altText": "A large glacier with stripes of different colored rock nestled in between barren mountain slopes.",
//                   "title": "Logan Glacier",
//                   "id": 389,
//                   "caption": "Wrangell-St. Elias National Park contains the greatest concentration of glaciers in North America.  More than 3000 glaciers covering over three million acres of land are found in the park.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7AB2FD-1DD8-B71B-0BC380F8D220B0BA.jpg"
//               },
//               {
//                   "credit": "NPS Photo/ Bryan Petrtyl",
//                   "altText": "Four large snow covered mountains rise above dense forest into blue skies.",
//                   "title": "Wrangell Mountains",
//                   "id": 391,
//                   "caption": "The Wrangell Mountains dominate the view of the northern half of the park.   This range lies entirely within the park and reaches 16,390 ft (4,996 m) in height.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7AB5F0-1DD8-B71B-0B0A0B409DEAB3ED.jpg"
//               }
//           ],
//           "designation": "National Park & Preserve",
//           "parkCode": "wrst",
//           "id": "B7944940-3FE5-4F9B-80AB-2FD78A4CDD48",
//           "fullName": "Wrangell - St Elias National Park & Preserve"
//       },
//       {
//           "states": "ID,MT,WY",
//           "directionsInfo": "Yellowstone National Park covers nearly 3,500 square miles in the northwest corner of Wyoming (3% of the park is in Montana and 1% is in Idaho). Yellowstone has five entrance stations, and several are closed to regular vehicles during winter. It takes many hours to drive between these entrances, so be sure to check the status of roads at the entrance you intend to use while planning your trip and before you arrive.",
//           "directionsUrl": "http://www.nps.gov/yell/planyourvisit/directions.htm",
//           "url": "https://www.nps.gov/yell/index.htm",
//           "weatherInfo": "Yellowstone's weather can vary quite a bit, even in a single day. In the summer, daytime highs can exceed 70F (25C), only to drop 20 or more degrees when a thunderstorm rolls through. It can snow during any month of the year, and winter lows frequently drop below zero, especially at night. Bring a range of clothing options, including a warm jacket and rain gear, even in the summer.",
//           "name": "Yellowstone",
//           "latLong": "lat:44.59824417, long:-110.5471695",
//           "description": "Visit Yellowstone and experience the world's first national park. Marvel at a volcano’s hidden power rising up in colorful hot springs, mudpots, and geysers. Explore mountains, forests, and lakes to watch wildlife and witness the drama of the natural world unfold. Discover the history that led to the conservation of our national treasures “for the benefit and enjoyment of the people.”",
//           "images": [
//               {
//                   "credit": "NPS/Jim Peaco",
//                   "altText": "Crowd watching Aurum Geyser erupt",
//                   "title": "Aurum Geyser",
//                   "id": 1789,
//                   "caption": "Aurum Geyser Erupting",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7D2FBB-1DD8-B71B-0BED99731011CFCE.jpg"
//               },
//               {
//                   "credit": "NPS/Jim Peaco",
//                   "altText": "People on boardwalk watching Beehive Geyser erupt",
//                   "title": "Beehive Geyser",
//                   "id": 1791,
//                   "caption": "Visitors to the Lower Geyser Basin watch Beehive Geyser Erupt.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7D334F-1DD8-B71B-0B108C7771F4E854.jpg"
//               },
//               {
//                   "credit": "NPS/Neal Herbert",
//                   "altText": "Photo of bison in Lamar Valley",
//                   "title": "Bison in Lamar Valley",
//                   "id": 1792,
//                   "caption": "Bison in Lamar Valley",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7D34E6-1DD8-B71B-0BBB1C0F478318E2.jpg"
//               },
//               {
//                   "credit": "NPS/Neal Herbert",
//                   "altText": "Photo of black bear sow with cub",
//                   "title": "Black bear sow with cub",
//                   "id": 1793,
//                   "caption": "A sow black bear walks with her cub.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7D368B-1DD8-B71B-0B92925065B93463.jpg"
//               },
//               {
//                   "credit": "NPS/Diane Renkin",
//                   "altText": "A visitor stands on a boardwalk near a hot spring and a lake",
//                   "title": "Black Pool",
//                   "id": 1794,
//                   "caption": "Black Pool at the West Thumb Geyser Basin",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7D383B-1DD8-B71B-0BEC4A4D6BDF7CAD.jpg"
//               },
//               {
//                   "credit": "NPS/Neal Herbert",
//                   "altText": "A bull elk bugles",
//                   "title": "Bull Elk bugling",
//                   "id": 1795,
//                   "caption": "Bull elk bugling in the fall season at Mammoth Hot Springs.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7D3A45-1DD8-B71B-0BE742D5DF5A03BE.jpg"
//               },
//               {
//                   "credit": "NPS/Jim Peaco",
//                   "altText": "Photo of a wolf howling",
//                   "title": "Wolf howling",
//                   "id": 1796,
//                   "caption": "The alpha male of the Canyon wolf pack.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7D3BD3-1DD8-B71B-0BB607F9BAAE1271.jpg"
//               },
//               {
//                   "credit": "NPS/Neal Herbert",
//                   "altText": "People walking down wooden steps in a canyon with waterfall at the bottom",
//                   "title": "Red Rock Point of the Grand Canyon",
//                   "id": 1809,
//                   "caption": "Climbing the steps to Red Rock Point in the Grand Canyon of the Yellowstone.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7D51BA-1DD8-B71B-0B6B502BB63607A5.jpg"
//               },
//               {
//                   "credit": "NPS/Neal Herbert",
//                   "altText": "Photo of cottonwoods and bison along the Lamar River",
//                   "title": "Cottonwoods and bison along the Lamar River",
//                   "id": 1810,
//                   "caption": "Fall colors the cottonwoods and bison in the Lamar River Valley",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7D53BA-1DD8-B71B-0B0F52EAD45E0816.jpg"
//               },
//               {
//                   "credit": "NPS/Herbert",
//                   "altText": "People hike along a trail next to a waterfall.",
//                   "title": "Exploring the South Rim Trail at Canyon",
//                   "id": 1811,
//                   "caption": "If you are willing to walk a little ways, you can find some extraordinary views of the Grand Canyon of the Yellowstone, like this trail on the South Rim.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7D5586-1DD8-B71B-0BA4D9C51675075B.jpg"
//               },
//               {
//                   "credit": "NPS/Jim Peaco",
//                   "altText": "Visitors walk into rustic building",
//                   "title": "Fishing Bridge Museum",
//                   "id": 1812,
//                   "caption": "The Fishing Bridge Museum with it's stone-and-log architecture became a prototype for park buildings all around the country.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7D573E-1DD8-B71B-0B5C0DF5BB91D043.jpg"
//               },
//               {
//                   "credit": "NPS/Peaco",
//                   "altText": "Brilliant colors of a hot spring",
//                   "title": "Grand  Prismatic",
//                   "id": 1813,
//                   "caption": "The bright colors found in Grand Prismatic Spring come from \"thermophiles\" —microorganisms that thrive in hot temperatures.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7D5920-1DD8-B71B-0B83F012ED802CEA.jpg"
//               },
//               {
//                   "credit": "NPS/Renkin",
//                   "altText": "Geyser erupting",
//                   "title": "Great Fountain Geyser",
//                   "id": 1814,
//                   "caption": "Great Fountain Geyser erupts against a blue summer sky.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7D5AB4-1DD8-B71B-0BF91CF45345ED16.jpg"
//               },
//               {
//                   "credit": "NPS/Herbert",
//                   "altText": "Close up zoom of a grizzly bear",
//                   "title": "Grizzly Bear near Swan Lake",
//                   "id": 1815,
//                   "caption": "A male grizzly can weigh between 200–700 pounds!",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7D5C61-1DD8-B71B-0B1137675782D47A.jpg"
//               },
//               {
//                   "credit": "Photo courtesy of Xanterra",
//                   "altText": "Yellowstone Lake Hotel",
//                   "title": "Lake Yellowstone Hotel -",
//                   "id": 1816,
//                   "caption": "Lake Hotel opened in 1891 and is the oldest hotel operating in the park!",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7D5DF3-1DD8-B71B-0B8364C14266BF61.jpg"
//               },
//               {
//                   "credit": "NPS/Peaco",
//                   "altText": "Entrance building with vehicle line.",
//                   "title": "North Entrance",
//                   "id": 1817,
//                   "caption": "The North Entrance to Yellowstone is open year-round.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7D5F87-1DD8-B71B-0B7911FE1EA4A30A.jpg"
//               },
//               {
//                   "credit": "NPS/Peaco",
//                   "altText": "A crowd in front of a geyser",
//                   "title": "People enjoying a winter eruption of Old Faithful",
//                   "id": 1818,
//                   "caption": "Did you know that you can visit Old Faithful in the winter? You need to take a snowcoach or snowmobile!",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7D610A-1DD8-B71B-0BEF676112007818.jpg"
//               },
//               {
//                   "credit": "NPS/Peaco",
//                   "altText": "Visitors walk in front of brightly colored landscape.",
//                   "title": "Palette Spring",
//                   "id": 1843,
//                   "caption": "The vibrant colors of Palette Springs are formed by \"thermophiles\" -- heat-loving organisms.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7D8903-1DD8-B71B-0BA8669AEEF74379.jpg"
//               },
//               {
//                   "credit": "NPS/Olliff",
//                   "altText": "Two bighorn sheep",
//                   "title": "Bighorn Sheep",
//                   "id": 1851,
//                   "caption": "Two bighorn rams chew their cud.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C7D95DD-1DD8-B71B-0BC4FA19BD72F0EC.jpg"
//               }
//           ],
//           "designation": "National Park",
//           "parkCode": "yell",
//           "id": "F58C6D24-8D10-4573-9826-65D42B8B83AD",
//           "fullName": "Yellowstone National Park"
//       },
//       {
//           "states": "CA",
//           "directionsInfo": "You can drive to Yosemite all year and enter via Highways 41, 140, and 120 from the west. Tioga Pass Entrance (via Highway 120 from the east) is closed from around November through late May or June. Hetch Hetchy is open all year but may close intermittently due to snow.\n\nPlease note that GPS units do not always provide accurate directions to or within Yosemite.",
//           "directionsUrl": "http://www.nps.gov/yose/planyourvisit/driving.htm",
//           "url": "https://www.nps.gov/yose/index.htm",
//           "weatherInfo": "Yosemite National Park covers nearly 1,200 square miles (3,100 square km) in the Sierra Nevada, with elevations ranging from about 2,000 feet (600 m) to 13,000 ft (4,000 m). Yosemite receives 95% of its precipitation between October and May (and over 75% between November and March). Most of Yosemite is blanketed in snow from about November through May. (Yosemite Valley can be rainy or snowy in any given winter storm.)",
//           "name": "Yosemite",
//           "latLong": "lat:37.84883288, long:-119.5571873",
//           "description": "Not just a great valley, but a shrine to human foresight, the strength of granite, the power of glaciers, the persistence of life, and the tranquility of the High Sierra.\n\nFirst protected in 1864, Yosemite National Park is best known for its waterfalls, but within its nearly 1,200 square miles, you can find deep valleys, grand meadows, ancient giant sequoias, a vast wilderness area, and much more.",
//           "images": [
//               {
//                   "credit": "NPS / Cindy Jacoby",
//                   "altText": "A mountain reflecting in a lake.",
//                   "title": "Cathedral Peak and Lake in Autumn",
//                   "id": 4009,
//                   "caption": "Cathedral Peak is one of the most recognizable peaks in the Yosemite Wilderness.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C84C3C0-1DD8-B71B-0BFF90B64283C3D8.jpg"
//               },
//               {
//                   "credit": "NPS / Bob Roney",
//                   "altText": "A rainbow over a mountain in the distance.",
//                   "title": "Rainbow over Half Dome",
//                   "id": 4012,
//                   "caption": "A hike up to Sentinel Dome rewards people with great views of the landscape around them.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C84C6CF-1DD8-B71B-0B1C7CB883AA8FB1.jpg"
//               },
//               {
//                   "credit": "NPS",
//                   "altText": "Mountains reflecting in water",
//                   "title": "Glen Aulin",
//                   "id": 4013,
//                   "caption": "Glen Auilin is one of five High Sierra Camps, located in the Yosemite high country.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C84C82D-1DD8-B71B-0B8D6902B62369E2.jpg"
//               },
//               {
//                   "credit": "NPS",
//                   "altText": "Mountains surrounding a lake.",
//                   "title": "Tenaya Lake at Sunset",
//                   "id": 4014,
//                   "caption": "Tenaya Lake is a favorite place to stop along the Tioga Road in summer.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C84C97E-1DD8-B71B-0B5DD2112C58C175.jpg"
//               },
//               {
//                   "credit": "NPS / Cindy Jacoby",
//                   "altText": "Glaciated valley with vertical cliffs.",
//                   "title": "Yosemite Valley from Tunnel View",
//                   "id": 4015,
//                   "caption": "Tunnel View is perhaps one of the most photographed views in the park.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C84CAEC-1DD8-B71B-0BA0EEA50BB40F8B.jpg"
//               },
//               {
//                   "credit": "NPS / Cindy Jacoby",
//                   "altText": "Two tall waterfalls flowing down snow covered granite walls.",
//                   "title": "Yosemite Falls on a Winter Morning",
//                   "id": 4016,
//                   "caption": "Yosemite Falls will sometimes only trickle at the end of summer, but wet winters can rejuvenate the flow.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C84CC4C-1DD8-B71B-0BE967E5E5D93F25.jpg"
//               },
//               {
//                   "credit": "NPS Photo / Cindy Jacoby",
//                   "altText": "A waterfall flowing down a granite cliff.",
//                   "title": "Lower Yosemite Fall",
//                   "id": 4017,
//                   "caption": "The walk to Lower Yosemite Fall is a popular and easy hike.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C84CDD0-1DD8-B71B-0B6E5868AFC75B6B.jpg"
//               },
//               {
//                   "credit": "NPS / Cindy Jacoby",
//                   "altText": "Granite dome with trace amounts of snow.",
//                   "title": "Half Dome",
//                   "id": 4018,
//                   "caption": "Half Dome is one of the most recognizable granitic formations in the world.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C84CF74-1DD8-B71B-0B9C7FF83F7C68EB.jpg"
//               },
//               {
//                   "credit": "NPS / Christine Fey",
//                   "altText": "Massive cliff of El Capitan reflected in the Merced River",
//                   "title": "El Capitan",
//                   "id": 4046,
//                   "caption": "El Capitan rises over 3,000 feet above the floor of Yosemite Valley.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C84FB6A-1DD8-B71B-0BC49E4A26E498FA.jpg"
//               },
//               {
//                   "credit": "NPS / Cindy Jacoby",
//                   "altText": "Cluster of tall trees with cloudy sky.",
//                   "title": "Giant Sequoia Trees in the Mariposa Grove of Giant Sequoias",
//                   "id": 4112,
//                   "caption": "Yosemite National Park's massive giant sequoias (Sequoiadendron giganteum) live in three groves in the park. The most famous of these is the Mariposa Grove, which contains about 500 mature giant sequoias.",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C8560E1-1DD8-B71B-0BD3183636F4B861.jpg"
//               },
//               {
//                   "credit": "NPS / Cindy Jacoby",
//                   "altText": "Very tall sequoia trees in a sequoia grove.",
//                   "title": "Giant Sequoia Tree",
//                   "id": 4123,
//                   "caption": "Giant Sequoia trees are the largest living things (by volume) on the planet. Though not the tallest trees, one feels miniature in their presence..",
//                   "url": "https://www.nps.gov/common/uploads/structured_data/3C856E76-1DD8-B71B-0B2211CE7A2E227C.jpg"
//               }
//           ],
//           "designation": "National Park",
//           "parkCode": "yose",
//           "id": "4324B2B4-D1A3-497F-8E6B-27171FAE4DB2",
//           "fullName": "Yosemite National Park"
//       }
//   ],
//   "limit": 50,
//   "start": 1
// }