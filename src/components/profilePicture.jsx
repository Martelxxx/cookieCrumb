import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from './context'; // Adjust the path as needed
import './profilePicture.css';
import UpdateForm from './updateForm';

const Profile = () => {
  const { user, loading } = useUser();
  const [profilePicture, setProfilePicture] = useState(null);
  const [message, setMessage] = useState('');
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [username, setUsername] = useState(user.username);
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setProfilePicture(event.target.files[0]);
  };

  const handleUpload = async () => {
    console.log('handleUpload called');
    try {
      if (user.profilePicture) {
        const deleteResponse = await axios.delete('http://localhost:3015/delete', {
          data: { username: user.username },
          withCredentials: true,
        });
  
        if (deleteResponse.status !== 200) {
          setMessage('Failed to remove existing profile picture');
          return;
        }
      }
  
      const formData = new FormData();
      formData.append('profilePicture', profilePicture);
      formData.append('username', user.username);
  
      const uploadResponse = await axios.post('http://localhost:3015/upload', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (uploadResponse.status === 200) {
        setMessage('Profile picture uploaded successfully');
        user.profilePicture = {
            data: await profilePicture.arrayBuffer().then(buffer => {
              let binary = '';
              let bytes = new Uint8Array(buffer);
              let len = bytes.byteLength;
              for (let i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
              }
              return btoa(binary);
            }),
            contentType: profilePicture.type,
          };
      } else {
        setMessage('Failed to upload profile picture');
      }
    } catch (error) {
      setMessage('Failed to upload profile picture');
      console.error('Error uploading profile picture:', error);
    }
  };

  const handleRemove = async () => {
    try {
      const response = await axios.delete('http://localhost:3015/delete', {
        data: { username: user.username },
        withCredentials: true,
      });

      if (response.status === 200) {
        setMessage('Profile picture removed successfully');
        user.profilePicture = null; // Update the local state to reflect the removal
      } else {
        setMessage('Failed to remove profile picture');
      }
    } catch (error) {
      setMessage('Failed to remove profile picture');
      console.error('Error removing profile picture:', error);
    }
  };

  const handleShowUpdateForm = () => {
    setShowUpdateForm(!showUpdateForm);
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
            <p>Picture Here</p>
            {user.profilePicture ? (
            <img src={user.profilePicture} alt="Profile" style={{ width: '100px', height: '100px' }} />
            ) : (
            <p>No profile picture</p>
            )}
            <button onClick={handleRemove}>Remove Picture</button>
          </div>
        )}
        <div>
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleUpload}>Upload</button>
        </div>
        {message && <p>{message}</p>}
        <button onClick={handleShowUpdateForm}>Update Information</button>
        {showUpdateForm && <UpdateForm user={user} setMessage={setMessage} />}
      </div>
    </div>
  );
};

export default Profile;
