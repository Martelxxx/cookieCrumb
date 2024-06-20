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
    <>
      <div className='loginContainer'>
        <div className='mainContainer'>
          <div className='titleContainer'>
            <div>Sign In</div>
          </div>
          <p className='smallText'>Sign in with your social media account or email address</p>
          <div className='socialMedia'>
            <div className='fb'><i className="fab fa-facebook-f"></i>Facebook</div>
            <div className='twt'>Twitter</div>
            <div className='goog'>Google</div>
          </div>
          <br />
          <div className='sepCon'>
            <div className='line'></div>
            <div className='or-circle'>
              <span className='or'>or</span>
            </div>
            <div className='line'></div>
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
          <br />
          <div>
            <a href='/forgot-password'>Forgot password?</a>  
          </div>
          <br />
          <p className='smallText'>Click <a href='/'>here</a> to return Home</p>   
          {message && <p>{message}</p>}
        </div>
      </div>
    </>
  );
};

export default Login;
