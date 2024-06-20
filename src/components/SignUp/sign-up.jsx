import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './sign-up.css'; // Make sure to create a CSS file for styling


const SignUp = () => {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (countdown > 0) {
        timer = setTimeout(() =>  setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
        navigate('/'); // replace '/login' with the path to your login page
    }
    return () => clearTimeout(timer);
    }, [countdown, navigate]);

  const handleSignUp = async () => {
    setUsernameError('');
    setPasswordError('');
    setMessage('');

    if (password !== confirmPassword) {
      setPasswordError('Password and Confirm Password must match');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:3015/register',
        { username, password, confirmPassword, firstName,
            lastName, },
        { withCredentials: true }
      );
      setMessage(response.data.message);
      if (response.data.message === 'User registered successfully') {
        setUsername(response.data);
        console.log('User registered successfully', response, 'this is the response', response.data); 
        setTimeout(() => {
        navigate('/'); // replace '/login' with the path to your login page
      }, 3000); // 3000 milliseconds = 3 seconds
    }
    if (response.data.message === 'User registered successfully') {
        setCountdown(3); // Start the countdown when the submit button is clicked
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.message;
        if (errorMessage && errorMessage.includes('Username already taken')) {
          setUsernameError(errorMessage);
        } else {
          setMessage(errorMessage);
        }
      } else {
        setMessage('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className='loginContainer'>
      <div className='mainContainer'>
        <div className='titleContainer'>
          <div>Create an Account</div>
        </div>
        <p className='smallText'>Sign up with your social media account or email address</p>
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
        <div class='line'></div>
        </div>
        <br />
        <div className='inputContainer'>
          <input
            value={username}
            placeholder="Enter your username here"
            onChange={(event) => setUsername(event.target.value)}
            className='inputBox'
          />
          <label className="errorLabel">{usernameError}</label>
        </div>
        <br />
        <div className='inputContainer'>
          <input
            value={firstName}
            placeholder="Enter your first name here"
            onChange={(event) => setFirstName(event.target.value)}
            className='inputBox'
          />
          <label className="errorLabel">{usernameError}</label>
        </div>
        <br />
        <div className='inputContainer'>
          <input
            value={lastName}
            placeholder="Enter your last name here"
            onChange={(event) => setLastName(event.target.value)}
            className='inputBox'
          />
          <label className="errorLabel">{usernameError}</label>
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
          <label className="errorLabel">{passwordError}</label>
        </div>
        <br />
        <div className='inputContainer'>
          <input
            type="password"
            value={confirmPassword}
            placeholder="Confirm your password here"
            onChange={(event) => setConfirmPassword(event.target.value)}
            className='inputBox'
          />
          <label className="errorLabel">{passwordError}</label>
        </div>
        <br />
        <div className='inputContainer'>
          <input className='inputButton' type="button" onClick={handleSignUp} value='Sign Up' />
          <p className='smallText'>Already have an account? Click <a href='/signin'>here</a></p>
          <p className='smallText'>Click <a href='/'>here</a> to return Home</p>

          {countdown !== null && <p>Redirecting in {countdown}...</p>} {/* Display the countdown */}

        </div>

        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default SignUp;
