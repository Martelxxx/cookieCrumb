import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './sign-in.css';
import axios from 'axios';
import { useUser } from '../context/'; // Correctly import the hook

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { fetchUserData } = useUser();

  const handleSignIn = async () => {
    try {
      const response = await axios.post('http://localhost:3015/login', { username, password }, { withCredentials: true });
      setMessage(response.data.message);
      if (response.data.success) {
        await fetchUserData(); // Fetch the latest user data
        navigate('/dashboard'); // Navigate to dashboard
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className='loginContainer'>
      <div className='mainContainer'>
        <div className='titleContainer'>
          <div>Sign In</div>
        </div>
        <br />
        <div className='inputContainer'>
          <input
            value={username}
            placeholder="Enter your username here"
            onChange={(event) => setUsername(event.target.value)}
            className='inputBox'
          />
        </div>
        <br />
        <div className='inputContainer'>
          <input
            type="password"
            value={password}
            placeholder="Enter your password here"
            onChange={(event) => setPassword(event.target.value)}
            className='inputBox'
          />
        </div>
        <br />
        <div className='inputContainer'>
          <input className='inputButton' type="button" onClick={handleSignIn} value='Sign In' />
        </div>
        <br></br>
        <a href='/forgot-password'>Forgot password?</a>  
        <a href='/'>Return to Home Page</a>    
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default Login;
