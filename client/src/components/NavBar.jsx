import React from 'react';
import { UserProfile } from '../UserProfile';
import '../App.css';
import {
    BrowserRouter as Router,
    Link
  } from 'react-router-dom';

const NavBar = (props) => (
    <nav className='NavBar'>
        <h1>National Parks Planner</h1>
        <UserProfile user={props.user} logout={props.logout} />
        <Link to="/">Home | </Link>{' '}
        <Link to="/parks-to-visit">My List</Link>{' '}
    </nav>
)
export default NavBar;

