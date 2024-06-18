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
  const [matches, setMatches] = useState([]);
  const [geolocations, setGeolocations] = useState([]);
  const [showProfilePicture, setShowProfilePicture] = useState(false);

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
        // Include any other headers your API requires
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

  const handleOnClick = () => {
    setShowProfilePicture(prevShowProfilePicture => !prevShowProfilePicture);
};

  const compareCoordinates = (coord1, coord2) => {
    if (coord1 === null || coord2 === null) {
      return false;
    }
    return coord1.toFixed(5) === coord2.toFixed(5);
  };

  // Filter geolocations to only include those that match the current location
  const matchingGeolocations = geolocations.filter((geo) => {
    return compareCoordinates(geo.latitude, location.latitude) && compareCoordinates(geo.longitude, location.longitude);
  });

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

  return (
    <>
    <div className={`mainPage ${showProfilePicture ? 'shifted' : ''}`}>

    <div className="profileCon" data-counter="0">
    <div className="dashboard-container">
      <div className="dashboard-content">
        <h1>Welcome to Cookie Trail, {user.firstName}</h1>
        <p>This is the home page. Howdy</p>
    <div className="proPic">
        {user.profilePicture && (
            <img src={user.profilePicture} alt="Profile" style={{ width: '100px', height: '100px' }} />
            )}
    </div>
        {/* {location.latitude && location.longitude && (
          <div>
            <p>Current Location:</p>
            <p>Latitude: {location.latitude}</p>
            <p>Longitude: {location.longitude}</p>
          </div>
        )} */}
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
          {/* <p>Latitude: {geo.latitude}</p>
          <p>Longitude: {geo.longitude}</p> */}
          <p>Paths Crossed At: {new Date(geo.timestamp).toLocaleString()}</p>
          <button>Chat</button>
          <hr />
        </div>
      ))}
    </div>
    </div>
    </div>
    <span class="flapText1"><b>Chat</b></span>
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
