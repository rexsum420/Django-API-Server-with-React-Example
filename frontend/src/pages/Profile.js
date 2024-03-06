import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function Profile() {
  const { username } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [profileCreatedAt, setProfileCreatedAt] = useState(null);
  const [profileLastActive, setProfileLastActive] = useState(null);
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:8000/users/profile/${username}/`, {
          method: 'GET',
          headers: {
            'Authorization': `Token ${localStorage.getItem('Token')}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          console.log('Error!');
        } else {
          const data = await response.json();
          console.log(data);
          setProfileData(data);
          const createdAtDate = new Date(data.created);
          const lastActiveDate = new Date(data.last_active);
          console.log('createdAtDate:', createdAtDate);
          console.log('lastActiveDate:', lastActiveDate);
          setProfileCreatedAt(createdAtDate);
          setProfileLastActive(lastActiveDate);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };
  
    fetchProfile();
  }, [username]);
  

  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  const timeFormatter = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });

  return (
    <div>
    <h1>User Profile: {username}</h1>
    {profileData && Object.keys(profileData).length > 0 && (
      <div>
        <h2>Profile Details</h2>
        <p>Username: {profileData.user.username}</p>
        <p>Email: {profileData.user.email}</p>
        <p>Profile Created: {dateFormatter.format(profileCreatedAt)} {timeFormatter.format(profileCreatedAt)}</p>
        <p>Last Active: {dateFormatter.format(profileLastActive)} {timeFormatter.format(profileLastActive)}</p>
      </div>
    )}
  </div>
  );
}

export default Profile;
