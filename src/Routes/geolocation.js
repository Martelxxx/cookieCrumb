import express from 'express';
const router = express.Router();
import Geolocation from '../../models/geolocations.js';

// Middleware to authenticate user
const authenticateUser = (req, res, next) => {
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

router.post('/geolocation', authenticateUser, async (req, res) => {
  const { latitude, longitude } = req.body;
  const { id: userId, username } = req.session.user;

  try {
    const geolocation = new Geolocation({ userId, username, latitude, longitude });
    await geolocation.save();
    res.status(201).json({ message: 'Geolocation saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save geolocation', error: error.message });
  }
});

// Route to get all geolocations
router.get('/geolocation', authenticateUser, async (req, res) => {
    try {
      const geolocations = await Geolocation.find();
    //   console.log('from routes', geolocations);
      res.status(200).json(geolocations);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch geolocations', error: error.message });
    }
  });

// Like route
router.post('/like', authenticateUser, async (req, res) => {
    const { id } = req.body;
    const { user } = req.session;
  
    if (!id) {
      console.error('Geolocation ID is missing');
      return res.status(400).json({ message: 'Geolocation ID is required' });
    }
  
    try {
      const geolocation = await Geolocation.findById(id);
      if (!geolocation) {
        console.error(`Geolocation not found for ID: ${id}`);
        return res.status(404).json({ message: 'Geolocation not found' });
      }
  
      // Check if the user has already liked this geolocation
      if (geolocation.likedBy.includes(user.id)) {
        return res.status(400).json({ message: 'You have already liked this geolocation' });
      }
  
      geolocation.likes += 1;
      geolocation.likedBy.push(user.id);
      await geolocation.save();
  
      res.status(200).json({ likes: geolocation.likes });
    } catch (error) {
      console.error('Error liking geolocation:', error);
      res.status(500).json({ message: 'Failed to like geolocation', error: error.message });
    }
  });

  // Route to get total likes for a user
router.get('/total-likes', authenticateUser, async (req, res) => {
    const { id: userId } = req.session.user;
  
    try {
      const geolocations = await Geolocation.find({ userId });
      const totalLikes = geolocations.reduce((sum, geo) => sum + geo.likes, 0);
      res.status(200).json({ totalLikes });
    } catch (error) {
      console.error('Error fetching total likes:', error);
      res.status(500).json({ message: 'Failed to fetch total likes', error: error.message });
    }
  });

export default router;