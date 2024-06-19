import React, { useEffect, useState } from 'react';
import { useUser } from '../context'; // Adjust the path as needed
import axios from 'axios';
import './userWall.css';

const UserWall = ({ userId }) => {
  const { user } = useUser();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`http://localhost:3015/api/getMessages?recipientId=${userId}`, { withCredentials: true });
      console.log('Fetched messages:', response.data); // Log the response data
      if (Array.isArray(response.data)) {
        setMessages(response.data);
      } else {
        setMessages([]); // Fallback in case the response data is not an array
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([]); // Handle the error by setting messages to an empty array
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [userId]);

  const postMessage = async () => {
    try {
      const response = await axios.post('http://localhost:3015/postMessage', {
        recipientId: userId,
        message: newMessage,
      }, { withCredentials: true });
      if (response.status === 201) {
        setMessages([...messages, { sender: { username: 'You' }, message: newMessage, timestamp: new Date() }]);
        setNewMessage('');
        fetchMessages(); // Refresh messages after posting
      }
    } catch (error) {
      console.error('Error posting message:', error);
    }
  };

  return (
    <div className="wallSetCon">
      <div className="wallSettings">
        <h2>Wall</h2>
        {/* <div className="wallMessages"> */}
          {messages && messages.map((msg) => (
            <div key={msg._id} className="wallMessages">
              <div>From: {msg.sender.username}</div>
              <div>Recipient: {msg.recipient}</div>
              <div>Message: {msg.message}</div>
              <div>{new Date(msg.timestamp).toLocaleString()}</div>
            </div>
          ))}
        {/* </div> */}
        <button className="refreshButton" onClick={fetchMessages}>Refresh Messages</button> {/* Button to fetch messages */}
      </div>
    </div>
  );
};

export default UserWall;
