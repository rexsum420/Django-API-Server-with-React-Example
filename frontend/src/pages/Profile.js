import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function Profile() {
  const { username } = useParams();
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:8000/users/profile/${username}/`,
        { method: 'GET',
        headers: {
            'Authorization': `Token ${localStorage.getItem('Token')}`,
            'Content-Type': 'application/json',
            },
         });
        if (response.ok) {
          const data = await response.json();
          setProfileData(data[0]);
        } else {
          console.error('Failed to fetch profile data');
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfile();
  }, [username]);

  return (
    <div>
      <h1>User Profile: {username}</h1>
      {profileData && (
        <div>
          <h2>Profile Details</h2>
          <p>Username: {profileData.user.username}</p>
          <p>Email: {profileData.user.email}</p>
          <p>Profile Created: {profileData.created}</p>
          <p>Last Active: {profileData.last_active}</p>
        </div>
      )}
    </div>
  );
}

export default Profile;
