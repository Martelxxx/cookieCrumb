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

  const handleOnClick = () => {
    setShowProfilePicture((prevShowProfilePicture) => !prevShowProfilePicture);
  };

  const compareCoordinates = (coord1, coord2) => {
    if (coord1 === null || coord2 === null) {
      return false;
    }
    return coord1.toFixed(5) === coord2.toFixed(5);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/signin');
  };

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
        <div className="profileCon" data-counter="0">
          <div className="dashboard-container">
            <div className="dashboard-content">
              <h2>Welcome to Crumb Trail, {user.firstName}</h2>
              <p>This is the home page. Howdy</p>
              <p>You have received {totalLikes} likes.</p>
              <div className="proPic">
                {user.profilePicture && (
                  <img src={user.profilePicture} alt="Profile" style={{ width: '100px', height: '100px' }} />
                )}
              </div>
              <button onClick={handleLogout}>Logout</button>
            </div>
            <div className="map">
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
              <div>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Error ab totam tenetur facere dolorum beatae veritatis cumque sapiente officia modi. Repudiandae explicabo architecto, harum totam voluptates eveniet! Iusto, eveniet sint?
              </div>
              <div><p>Total matches: {matchingGeolocations.length}</p></div>
              <div className='matches'>
                {matchingGeolocations.map((geo) => (
                  <div key={geo._id}>
                    <p>User Name: {geo.username}</p>
                    <p>Paths Crossed At: {new Date(geo.timestamp).toLocaleString()}</p>
                    <p>Likes: {likes[geo._id]}</p>
                    <button onClick={() => handleLike(geo._id)}>Like</button>
                    <button>Chat</button>
                    <hr />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <span className="flapText1"><b>Chat</b></span>
          <span className="flapText2" onClick={handleOnClick}>
            <b>{showProfilePicture ? 'Return' : 'Settings'}</b>
          </span>
          {showProfilePicture && <Profile />}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
