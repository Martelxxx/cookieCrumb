import { Link, useLocation } from 'react-router-dom';
import cookieLogo from '../../assets/cookie.png';
import people1 from '../../assets/people1.png';
import people2 from '../../assets/people2.png';
import people3 from '../../assets/people3.png';
import './maincontent.css'; // Create a separate CSS file for styling

const MainContent = () => {
  const location = useLocation();

  if (location.pathname === '/signin' || location.pathname === '/signup') {
    return null;
  }

  return (
    <>
    <div className='homeContainer'>
    <div className='Container'>
    
      <h1>Welcome!</h1>
      
      <div className="text">
        <p>Discover and track your trails with Cookie Trail, the app that connects you with others based on your shared locations.</p>
        </div>
          <div className='text'>
            <p>Join our community to explore your journey and see who’s been where you’ve been.</p>
              </div>
        <div className='text'>
          <p>Sign up now to start tracking your cookie trails and make new connections!</p>
        </div>
      </div>
      

    <div className='Container'>
    <h1>Cookie Trail</h1>
      <div>
        <img src={cookieLogo} className="logo" alt="Cookie Trail logo" />
      </div>
      <h2>Join Today</h2>
      <div className="card">
        <Link to="/signin">
          <button>Sign In</button>
        </Link>
        <Link to="/signup">
          <button>Sign Up</button>
        </Link>
      </div>
      <p className="smallText">By signing up, you agree to the Terms of Service and Privacy Policy, including Cookie Use.</p>
      </div>

      <div className='Container'>
      <div className='triangle'>
        <img src={people1} className="logo" alt="Cookie Trail logo" style={{ width: '170px', height: '177px', borderRadius: '50px' }} />
      </div>
      <div>
        <img src={people3} className="logo" alt="Cookie Trail logo" style={{ width: '170px', height: '170px',  borderRadius: '50px' }} />
      </div>
      <div>
      <img src={people2} className="logo" alt="Cookie Trail logo" style={{ width: '170px', height: '170px', borderRadius: '50px' }} />      
      </div>
      </div>
      </div>    
    </>
  );
};

export default MainContent;
