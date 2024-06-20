// src/components/Dashboard/dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context'; // Adjust the path as needed
import sendGeolocation from '../geolocation'; // Adjust the path as needed
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import './dashboard.css'; // Make sure to create a CSS file for styling
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import Profile from '../profilePicture';
import UserWall from '../Wall/userWall';
// import Chat from '../Chat/chat';
// import io from 'socket.io-client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Geolocation from '../../../models/geolocations';

const Dashboard = () => {
  const { user, loading, logout } = useUser();
  const navigate = useNavigate();
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [geolocations, setGeolocations] = useState([]);
  const [showProfilePicture, setShowProfilePicture] = useState(false);
  const [likes, setLikes] = useState({});
  const [userLikes, setUserLikes] = useState(null);
  const [totalLikes, setTotalLikes] = useState(0);
//   const [isChatOpen, setIsChatOpen] = useState(false);
  const [recipientId, setRecipientId] = useState(null);
  const [newMessages, setNewMessages] = useState({}); // State to track new messages for each user
//   const [showChat, setShowChat] = useState(false);
  const [showWall, setShowWall] = useState(false);
  const [wallMessage, setWallMessage] = useState('');
  const [currentRecipient, setCurrentRecipient] = useState(null);
  const [weather, setWeather] = useState(null);

  const quotes = [
    "There is a fine line between serendipity and stalking. - David Coleman",
    "Most discoveries even today are a combination of serendipity and of searching. - Siddhartha Mukherjee",
    "I just like the word 'serendipity'. - Noah Centineo (and Adam Brown)",
    "Sometimes life drops blessings in your lap without your lifting a finger. Serendipity, they call it. - Charlton Heston",
    "There are no strangers here; Only friends you haven't yet met. - William Butler Yeats",
    "Strangers are just friends waiting to happen. - Rod McKuen",
    "Meeting new people and learning new things makes me feel more connected to the world and helps me to grow as a person. - Amanda Schull",
    "Each friend represents a world in us, a world possibly not born until they arrive. - Anaïs Nin"
  ];

  const [currentQuote, setCurrentQuote] = useState(quotes[0]);
  const [quoteKey, setQuoteKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setCurrentQuote(quotes[randomIndex]);
      setQuoteKey(prevKey => prevKey + 1);
    }, 10000);

    return () => clearInterval(interval);
  }, [quotes]);

  const lines = currentQuote.split('. ').map((line, index, array) => {
    const text = index === array.length - 1 ? line : `${line}.`;
    return (
      <div key={index} className="typeText" style={{ animationDelay: `${index * 2}s` }}>
        {text}
      </div>
    );
  });

  useEffect(() => {
    let intervalId;

    const updateLocation = async () => {
      try {
        const geoData = await sendGeolocation();
        setLocation(geoData);
      } catch (error) {
        console.error('Failed to update location:', error);
      }
    };

    const fetchGeolocations = async () => {
      try {
        const response = await axios.get('http://localhost:3015/api/geolocation', { withCredentials: true });
        setGeolocations(response.data);
      } catch (error) {
        console.error('Failed to fetch geolocations:', error);
      }
    };

    if (user) {
      updateLocation(); // Update location immediately when component mounts
      intervalId = setInterval(updateLocation, 10 * 60 * 1000); // Update location every 10 minutes
      fetchGeolocations(); // Fetch all geolocations when component mounts
    }

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, [user]);

  useEffect(() => {
    fetch('/geolocation', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include session cookie
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setGeolocations(data);
      })
      .catch((error) => {
        console.error('Failed to fetch geolocations:', error);
      });
  }, []);

  useEffect(() => {
    const initialLikes = {};
    geolocations.forEach((geo) => {
      initialLikes[geo._id] = geo.likes || 0;
    });
    setLikes(initialLikes);
  }, [geolocations]);

  const handleLike = async (id) => {
    try {
      const response = await axios.post('http://localhost:3015/api/like', { id }, { withCredentials: true });
      if (response.status === 200) {
        setLikes((prevLikes) => ({ ...prevLikes, [id]: response.data.likes }));
      } else {
        console.error('Error liking match:', response.data.message);
      }
    } catch (error) {
      console.error('Error liking match:', error.response ? error.response.data.message : error.message);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/users/${user}`); // replace with your actual API endpoint
        setUserLikes(response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchTotalLikes = async () => {
      try {
        const response = await axios.get('http://localhost:3015/api/total-likes', { withCredentials: true });
        if (response.status === 200) {
          setTotalLikes(response.data.totalLikes);
        }
      } catch (error) {
        console.error('Error fetching total likes:', error);
      }
    };

    if (user) {
      fetchTotalLikes();
    }
  }, [user]);

//   useEffect(() => {
//     if (user && user.id) {
//       const socket = io('http://localhost:3015');

//       console.log('Joining room:', user.id);
//       socket.emit('joinRoom', user.id);

//       socket.on('privateMessage', (data) => {
//         console.log('Message received:', data);
//         const { from } = data;
//         setNewMessages((prev) => ({
//           ...prev,
//           [from]: (prev[from] || 0) + 1,
//         }));
//         setShowChat(true); // Show chat window when a new message is received
//         toast('New message received!');
//       });

//       return () => {
//         socket.off('privateMessage');
//       };
//     }
//   }, [user]);

// Fetch weather data when location updates
useEffect(() => {
    const fetchWeather = async () => {
      if (location.latitude && location.longitude) {
        try {
          const response = await axios.get(`https://api.weatherapi.com/v1/current.json?key=2d7837795a4548a58be145553241505&q=${location.latitude},${location.longitude}`);
          setWeather(response.data);
        } catch (error) {
          console.error('Error fetching weather data:', error);
        }
      }
    };

    fetchWeather();
  }, [location]);

  const handleOnClick = () => {
    setShowProfilePicture((prevShowProfilePicture) => !prevShowProfilePicture);
  };

  const compareCoordinates = (coord1, coord2) => {
    if (coord1 === null || coord2 === null) {
      return false;
    }
    return coord1.toFixed(5) === coord2.toFixed(5); // amount of decimals in search coordinates
  };

  const handleWallClick = () => {
    setShowWall((prevShowWall) => !prevShowWall);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/signin');
  };

  const postToWall = async (recipientId) => {
    try {
      const response = await axios.post('http://localhost:3015/api/postMessage', {
        recipientId,
        message: wallMessage,
      }, { withCredentials: true });
      if (response.status === 201) {
        toast('Message posted to wall!');
        setWallMessage(''); // Clear the message input
      }
    } catch (error) {
      console.error('Error posting message to wall:', error);
      toast('Failed to post message');
    }
  };

//   const initiateChat = (id) => {
//     setRecipientId(id);
//     setNewMessages((prev) => ({ ...prev, [id]: 0 })); // Reset new messages count for this recipient
//     setShowChat(true); // Show chat window when initiating chat
//   };

  if (loading) {
    return <div>Loading...</div>; // Handle loading state
  }

  if (!user) {
    return <div>Unauthorized</div>; // Handle unauthorized state
  }

  const matchingGeolocations = geolocations.filter((geo) =>
    compareCoordinates(geo.latitude, location.latitude) &&
    compareCoordinates(geo.longitude, location.longitude)
  );

  return (
    <>
      <div className={`mainPage ${showProfilePicture ? 'shifted' : ''}`}>
      <div className={`mainPage ${showWall ? 'shifted1' : ''}`}>
        <div className="profileCon" data-counter="0">
          <div className="dashboard-container">
            <div className="dashboard-content">
              <h2>Welcome to Crumb Trail, {user.firstName}</h2>
              <h4 key={quoteKey} className="typeText">{lines}</h4>
              <p>You have {totalLikes} cookies.</p>
              <div className="proPic">
                {user.profilePicture && (
                  <img src={user.profilePicture} alt="Profile" style={{ width: '100px', height: '100px' }} />
                )}
              </div>
              <button onClick={handleLogout}>Logout</button>
            </div>
            <div className="map">
                <div className='weather'>
            <p>Temperature: {weather.current.temp_c}°C</p>
            <p>Condition: {weather.current.condition.text}</p>
            </div>
              {location.latitude && location.longitude ? (
                <MapContainer
                  center={[location.latitude, location.longitude]}
                  zoom={13}
                  style={{ height: '400px', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {location.latitude && location.longitude && (
                    <Marker position={[location.latitude, location.longitude]} />
                  )}
                </MapContainer>
              ) : (
                <p>Loading map...</p>
              )}
            </div>
            <div className='profileInfo'>
              <div className='paths'>
                <h2>Paths Crossed</h2>"Exciting news! Below, you'll find a dynamic display of all the fascinating individuals you've encountered in the last 24 hours. Who knows what interesting connections await? Dive in and explore the paths that have crossed!
              </div>
              <div><p>Total matches: {matchingGeolocations.length}</p></div>
              <div className='matches'>
                {matchingGeolocations.map((geo) => (
                  <div key={geo._id} className="geo-container">
                    <p>User Name: {geo.username}</p>
                    <p>(User Profile 😊 Pic Here)</p>
                    <p>Paths Crossed At: {new Date(geo.timestamp).toLocaleString()}</p>
                    <p>Cookies: {likes[geo._id]}</p>
                    <button onClick={() => handleLike(geo._id)}>Send Cookie</button>
                    <button onClick={() => setCurrentRecipient(geo._id)}>Post</button>
                    <hr></hr>
                    {currentRecipient === geo._id && (
                        <div className="message-container">
                        <input
                            type="text"
                            value={wallMessage}
                            onChange={(e) => setWallMessage(e.target.value)}
                            placeholder="Write a message..."
                        />
                        <button onClick={() => postToWall(geo._id)}>Submit</button>
                    <hr />
                  </div>
                )}
                </div>
                ))}
              </div>
            </div>
          </div>
          <span className="flapText1"onClick={handleWallClick}>
            <b>{showWall ? 'Close' : 'Wall'}</b>
          </span>
          {showWall && <UserWall userId={user._id} />}
          <span className="flapText2" onClick={handleOnClick}>
            <b>{showProfilePicture ? 'Return' : 'Settings'}</b>
          </span>
          {showProfilePicture && <Profile />}
        </div>
      </div>
    </div>
    </>
  );
};

export default Dashboard;
