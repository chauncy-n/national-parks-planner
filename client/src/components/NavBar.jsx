import React from 'react';
import { UserProfile } from '../UserProfile';
import '../App.css';

const NavBar = (props) => (
    <nav className='NavBar'>
        <h1>National Parks Planner</h1>
        <UserProfile user={props.user} logout={props.logout} />
        this is the navbar with links
    </nav>
)
export default NavBar;