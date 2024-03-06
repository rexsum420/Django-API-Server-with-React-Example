import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import MenuBar from './components/MenuBar';
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Display404 from "./pages/Display404";

function App() {
  // Check for the presence of a token in localStorage
  const token = localStorage.getItem('Token');

  return (
    <div className="App">
      <Router>
        <MenuBar />
        <Routes>
          {token && token !== '' ? (
            <>
            <Route exact path="/" element={<Home />} />
            <Route path="/profile/:username" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Display404 />} />
            </>
          ) : (
            <Route exact path="/" element={<SignIn />} />
          )}
          <Route path='/signup' element={<SignUp />} />
          
        </Routes>
      </Router>
    </div>
  );
}

export default App;
