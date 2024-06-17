import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';
import Login from './components/SignIn/sign-in.jsx';
import SignUp from './components/SignUp/sign-up.jsx';
import MainContent from './components/MainContent/maincontent.jsx'; // Adjust the import path as needed
import Dashboard from './components/Dashboard/dashboard.jsx'; // Adjust the import path as needed
import { UserProvider } from './components/context.jsx';
import User from '../models/user.js';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <UserProvider>
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<MainContent />} />
          <Route path="/signin" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
    </UserProvider>
  );
}

export default App;
