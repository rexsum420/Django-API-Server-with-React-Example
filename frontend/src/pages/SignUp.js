import React from 'react';
import CustomCard from '../components/Card';
import { TextField, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function SignUp() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password2, setPassword2] = React.useState('');
  const [emailError, setEmailError] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');
  const navigate = useNavigate();

  const handleSignUp = async() => {
    // Check if email is in correct format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setEmailError('Invalid email format');
    } else {
      setEmailError('');
    }

    // Check if passwords match
    if (password !== password2) {
      setPasswordError('Passwords do not match');
    } else {
      setPasswordError('');
    }


    try {
        // Create account
        const signUpResponse = await fetch('http://localhost:8000/users/profile/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            email,
            password,
          }),
        });
  
        if (!signUpResponse.ok) {
          throw new Error('Failed to sign up');
        }
  
        // Obtain token
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
          
        }
  
        const tokenData = await tokenResponse.json();
  
        // Store token in localStorage
        localStorage.setItem('Token', tokenData.access);
        localStorage.setItem('Refresh', tokenData.refresh);

  
        // Redirect user to '/'
        navigate('/');
        window.location.reload();
      } catch (error) {
        console.error('Error:', error.message);
      }
    };
  
    

  return (
    <CustomCard header="Sign Up">
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
        label="Email"
        variant="outlined"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          // Check email format
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailPattern.test(e.target.value)) {
            setEmailError('Invalid email format');
          } else {
            setEmailError('');
          }
        }}
        error={Boolean(emailError)}
        helperText={emailError}
        InputProps={{ maxLength: 32 }}
      />
      <TextField
        label="Password"
        variant="outlined"
        fullWidth
        margin="normal"
        type="password"
        value={password}
        onChange={(e) => {
            setPassword(e.target.value);
            // Check password match
            if (password2 !== e.target.value) {
              setPasswordError('Passwords do not match');
            } else {
              setPasswordError('');
            }
          }}
          error={Boolean(passwordError)}
          helperText={passwordError}
        InputProps={{ maxLength: 32 }}
      />
      <TextField
        label="Confirm Password"
        variant="outlined"
        fullWidth
        margin="normal"
        type="password"
        value={password2}
        onChange={(e) => {
          setPassword2(e.target.value);
          // Check password match
          if (password !== e.target.value) {
            setPasswordError('Passwords do not match');
          } else {
            setPasswordError('');
          }
        }}
        error={Boolean(passwordError)}
        helperText={passwordError}
        InputProps={{ maxLength: 32 }}
      />
      <div style={{ textAlign: 'right', fontSize: '10px' }}>
        Already have an account? <Link to="/signin">Click Here</Link>
      </div>
      <Button variant="contained" color="primary" onClick={handleSignUp}>
        Create Account
      </Button>
    </CustomCard>
  );
}
