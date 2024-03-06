import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function Settings() {
  const [profileData, setProfileData] = useState(null);
  const [editedProfileData, setEditedProfileData] = useState({});
  const username = localStorage.getItem('username');
  const [email, setEmail] = React.useState('');
  const [emailError, setEmailError] = React.useState(false);
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
        if (response.ok) {
          const data = await response.json();
          setProfileData(data);
          // Initialize editedProfileData with profileData
          setEditedProfileData({ user: { ...data.user }, created: data.created, last_active: data.last_active });
        } else {
          console.error('Failed to fetch profile data');
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };
  
    fetchProfile();
  }, [username]);
  
  const handleEmailChange = (e) => {
    const { name, value } = e.target;
    setEmail(value); // Update email state
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) {
      setEmailError('Invalid email format');
    } else {
      setEmailError(''); // Clear email error if email is valid
    }
    setEditedProfileData(prevData => ({
      ...prevData,
      user: {
        ...prevData.user,
        [name]: value,
      }
    }));
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProfileData(prevData => ({
      ...prevData,
      user: {
        ...prevData.user,
        [name]: value,
      }
    }));
  };

  const handleSaveChanges = async () => {
    // Check if there's an email error
    if (emailError) {
      console.log('Invalid email format');
      return; // Exit early if email format is invalid
    }
    
    try {
      const response = await fetch(`http://localhost:8000/users/profile/${username}/`, {
        method: 'PUT', // Assuming PUT method updates the profile
        headers: {
          'Authorization': `Token ${localStorage.getItem('Token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedProfileData),
      });
      if (!response.ok) {
        console.log('Error!')
      } else {
        setProfileData({ ...editedProfileData });
        console.log('Profile updated successfully');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleDeleteProfile = async () => {

  };

  return (
    <div>
      <h1>Settings</h1>
      {profileData && (
        <div>
          <p>
            Username: 
            <input 
              type="text" 
              name="username" 
              value={editedProfileData.user ? editedProfileData.user.username : ''} 
              onChange={handleInputChange} 
            />
          </p>
          <p>
            Email: 
            <input 
                type="email" 
                name="email" 
                value={editedProfileData.user ? editedProfileData.user.email  : ''} 
                onChange={handleEmailChange}
            />
            {emailError && <span style={{ color: 'red' }}>{emailError}</span>} {/* Display email error */}
            </p>
          <p>Profile Created: {profileData.created}</p>
          <p>Last Active: {profileData.last_active}</p>
          <button onClick={handleSaveChanges}>Save Changes</button>
          <button onClick={handleDeleteProfile}>Delete Profile</button>
        </div>
      )}
    </div>
  );
}

export default Settings;
