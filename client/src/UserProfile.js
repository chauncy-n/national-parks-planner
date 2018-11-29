import React from 'react';
import './UserProfile.css';

export const UserProfile = props => {
  return (
    <div className="User-profile">
      <p>Hello, {props.user.name}!</p>
      <a onClick={props.logout}>Log Out!</a>
    </div>
  )
}
