import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp'
import MenuBar from './components/MenuBar';
import Home from  "./pages/Home";
import Settings from  "./pages/Settings";
import Profile from  "./pages/Profile";
import Display404 from  "./pages/Display404";

function App() {
  // Check for the presence of a token in localStorage
  const token = localStorage.getItem('Token');

  return (
    <div className="App">

      <Router>
        <MenuBar />
        <Routes>
          {/* Route for the main page if token exists */}
          {token && token != '' ? (
            <>
            <Route path="/" element={<Home />} />
            <Route path="/profile/:username" component={<Profile />} />
            <Route path="/settings" component={<Settings />} />
            <Route component={<Display404 />} />
            </>
          ) : (
            // Route for the sign-in page if token doesn't exist
            <Route path="/" element={<SignIn />} />
          )}
         <Route path='/signup' element={<SignUp />} />
         <Route component={<Display404 />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;