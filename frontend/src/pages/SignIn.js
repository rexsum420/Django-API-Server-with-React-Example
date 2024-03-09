import React from 'react';
import CustomCard from '../components/Card';
import { TextField, Button } from '@material-ui/core';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate directly

export default function SignIn() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [tokenData, setTokenData] = React.useState('');
  const navigate = useNavigate(); // Assign the result of useNavigate directly to navigate

  const handleSignIn = async () => {
    try {
      const tokenResponse = await fetch('http://localhost:8000/users/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!tokenResponse.ok) {
        
      } else {

      const tokenData = await tokenResponse.json();
      localStorage.setItem('Token', tokenData.token);
      localStorage.setItem('username', username);
      navigate('/');
      window.location.reload();
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  return (
    <>
      <CustomCard header="Sign In">
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          InputProps={{ maxLength: 32 }}
        />
        <TextField
          label="Password"
          variant="outlined"
          fullWidth
          margin="normal"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{ maxLength: 32 }}
        />
        <div style={{ textAlign: 'right', fontSize: '10px' }}>
          Don't have an account? <Link to="/signup">Click Here</Link>
        </div>
        <Button variant="contained" color="primary" onClick={handleSignIn}>
          Sign In
        </Button>
      </CustomCard>
    </>
  );
}
