import React, { useEffect, useState } from 'react';
import { useUser } from '../context'; // Adjust the path as needed
import axios from 'axios';
import './userWall.css';

const UserWall = ({ userId }) => {
  const { user } = useUser();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentMessage, setCurrentMessage] = useState(null)
  const [reply, setReply] = useState('')

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

  const handleReply = (msgId) => {
      setReply('');
      setCurrentMessage(null);

      const newReply = {
        _id: new Date().getTime().toString(),
        sender: { username: 'Your Username' }, // Replace with actual sender's username
        message: reply,
        timestamp: new Date(),
      };

      // Update messages state with new reply
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg._id === msgId ? { ...msg, replies: [...(msg.replies || []), newReply] } : msg
        )
      );
  }

  return (
    <div className="wallSetCon">
      <div className="wallSettings">
        <h2>Wall</h2>
        {messages && messages.map((msg) => (
          <div key={msg._id} className="wallMessages">
            <div>From: {msg.sender.username}</div>
            <div>Message: {msg.message}</div>
            <div>{new Date(msg.timestamp).toLocaleString()}</div>
            <button onClick={() => setCurrentMessage(msg._id)}>Reply</button>
            {currentMessage === msg._id && (
              <div className="replySection">
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Write your reply..."
                />
                <button onClick={() => handleReply(msg._id)}>Submit Reply</button>
              </div>
            )}
            {msg.replies && msg.replies.map(reply => (
              <div key={reply._id} className="replyMessage">
                
                <div>Message: {reply.message}</div>
                <div>{new Date(reply.timestamp).toLocaleString()}</div>
              </div>
            ))}
          </div>
        ))}
        <button className="refreshButton" onClick={fetchMessages}>Refresh Messages</button>
      </div>
    </div>
  );
};

export default UserWall;
