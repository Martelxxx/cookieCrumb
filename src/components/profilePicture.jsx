import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from './context'; // Adjust the path as needed
import './profilePicture.css';

const Profile = () => {
  const { user, loading } = useUser();
  const [profilePicture, setProfilePicture] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (event) => {
    setProfilePicture(event.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('profilePicture', profilePicture);

    try {
      const response = await axios.post('http://localhost:3015/upload', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage(response.data.message);
      // Optionally, update the user's profile picture in the state/context
    } catch (error) {
      setMessage('Failed to upload profile picture');
      console.error('Error uploading profile picture:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Unauthorized</div>;
  }

  return (
    <div className="profileSetCon">
    <div className="profileSettings">
      <h1>Profile</h1>
      <p>Username: {user.username}</p>
      <p>First Name: {user.firstName}</p>
      <p>Last Name: {user.lastName}</p>
      {user.profilePicture && (
        <div>
          <img src={user.profilePicture} alt="Profile" />
        </div>
      )}
      <div>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload</button>
      </div>
      {message && <p>{message}</p>}
    </div>
    </div>
  );
};

export default Profile;
