import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import cookieLogo from '../../assets/cookie.png';
import people1 from '../../assets/people1.png';
import people2 from '../../assets/people2.png';
import people3 from '../../assets/people3.png';
import './maincontent.css'; // Create a separate CSS file for styling
import React from 'react';
import '../../App.css'

const MainContent = () => {
  const location = useLocation();
  const [cards, setCards] = useState([
    {
      id: 1,
      text: "Dive into the Crumb Trail experience now! Start tracking your trails and forge new connections with fellow adventurers!",
    },
    {
      id: 2,
      text: "Join our community and embark on an exciting adventure, discovering who has crossed paths with you along your journey!",
    },
    {
      id: 3,
      text: "Explore and navigate your way with Crumb Trail, the app that brings together wanderers based on shared locations!",
    },
  ]);

  const switchCards = (index1, index2) => {
    setCards((prevCards) => {
      const newCards = [...prevCards];
      [newCards[index1], newCards[index2]] = [newCards[index2], newCards[index1]];
      return newCards;
    });
  };

  const moveImageRandomly = (image) => {
    const container = document.querySelector('.Container');
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    const imageWidth = image.offsetWidth;
    const imageHeight = image.offsetHeight;

    const randomX = Math.floor(Math.random() * (containerWidth + imageWidth)) - imageWidth;
    const randomY = Math.floor(Math.random() * (containerHeight + imageHeight)) - imageHeight;

    image.style.transform = `translate(${randomX}px, ${randomY}px)`;
    
    setTimeout(() => moveImageRandomly(image), Math.random() * 3000 + 1000); // Move again after 1-4 seconds
};

  useEffect(() => {
    const images = document.querySelectorAll('.movingImage');
    images.forEach(image => moveImageRandomly(image));
  }, []);

  if (location.pathname === '/signin' || location.pathname === '/signup') {
    return null;
  }

  return (
    <div className='homeContainer'>
      <div className='Container'>
        <nav>
          <h1>Welcome!</h1>
        </nav>
        <div className="text">
          {cards.map((card, index) => (
            <div key={card.id} className="card">
              <p>{card.text}</p>
              <button onClick={() => switchCards(index, (index + 1) % cards.length)}></button>
            </div>
          ))}
        </div>
      </div>
  
      <div className='Container'>
        <nav>
          <h1>Crumb Trail</h1>
        </nav>
        <div>
          <img src={cookieLogo} className="logo" alt="Cookie Trail logo" />
        </div>
        <h2>Join Today!</h2>
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
          <img src={people1} className='movingImage' alt="Cookie Trail logo" style={{ width: '370px', height: '377px', borderRadius: '50px' }} />
        </div>
        <div className='triangle'>
          <img src={people3} className='movingImage' alt="Cookie Trail logo" style={{ width: '370px', height: '370px', borderRadius: '50px' }} />
        </div >
        <div className='triangle'>
          <img src={people2} className='movingImage' alt="Cookie Trail logo" style={{ width: '370px', height: '370px', borderRadius: '50px' }} />
        </div>
      </div>
    </div>
  );
};

export default MainContent;
