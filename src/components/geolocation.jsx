// src/geolocation.jsx
import axios from 'axios';

const sendGeolocation = async () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          await axios.post('http://localhost:3015/api/geolocation', { latitude, longitude }, { withCredentials: true });
          console.log('Geolocation sent successfully');
          resolve({ latitude, longitude });
        } catch (error) {
          console.error('Failed to send geolocation:', error);
          reject(error);
        }
      }, (error) => {
        console.error('Error getting geolocation:', error);
        reject(error);
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
      reject(new Error('Geolocation is not supported by this browser.'));
    }
  });
};

export default sendGeolocation;
