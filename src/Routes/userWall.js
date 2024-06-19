import express from 'express';
import WallMessage from '../../models/wallMessage.js';
import User from '../../models/user.js';

const router = express.Router();

const authenticateUser = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

// Route to post a message on a user's wall
router.post('/postMessage', authenticateUser, async (req, res) => {
  const { recipientId, message } = req.body;
  const { id: userId, username } = req.session.user;

  console.log('Post Message Request:', { recipientId, message, userId, username });

  if (!recipientId || !message) {
    return res.status(400).json({ message: 'Recipient ID and message are required' });
  }

  try {
    const recipientUser = await User.findById(userId).select('username');
    if (!recipientUser) {
      return res.status(404).json({ message: 'Recipient user not found' });
    }

    const wallMessage = new WallMessage({
      sender: userId,
      recipient: recipientId,
      message,
      username, // sender's username
      recipientUsername: recipientUser.username, // recipient's username
      timestamp: new Date(),
    });

    await wallMessage.save();
    res.status(201).json({ message: 'Message posted successfully' });
  } catch (error) {
    console.error('Error posting message:', error);
    res.status(500).json({ message: 'Failed to post message', error: error.message });
  }
});

// Route to get all messages
router.get('/getMessages', authenticateUser, async (req, res) => {
  console.log('Get All Messages Request');

  try {
    const messages = await WallMessage.find().populate('sender', 'username').sort({ timestamp: -1 });
    console.log('Fetched messages:', messages);
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Failed to fetch messages', error: error.message });
  }
});

export default router;
