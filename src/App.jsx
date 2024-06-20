import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';
import Login from './components/SignIn/sign-in.jsx';
import SignUp from './components/SignUp/sign-up.jsx';
import MainContent from './components/MainContent/maincontent.jsx'; // Adjust the import path as needed
import Dashboard from './components/Dashboard/dashboard.jsx'; // Adjust the import path as needed
import { UserProvider } from './components/context.jsx';
import User from '../models/user.js';


const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isFooterSmall, setIsFooterSmall] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleSignInClick = () => {
    setIsFooterSmall(true); // Make footer smaller on sign-in click
  };

  return (
    <UserProvider>
    <Router>
      <div className="App">
      <div className="content">
        <Routes>
          <Route path="/" element={<MainContent />} />
          <Route path="/signin" element={<Login onSignInClick={handleSignInClick} />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
      <footer className={`footer ${isFooterSmall ? 'small' : ''}`}>
            <p>&copy; 2024 Crumb Trail. All rights reserved.</p>
            <div className='smallTalk'>
            <p>Terms & Conditions</p>
            <p>Privacy Policy</p>
            </div>
          </footer>
          </div>
    </Router>
    </UserProvider>
  );
}

export default App;
