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
      console.log('from routes', geolocations);
      res.status(200).json(geolocations);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch geolocations', error: error.message });
    }
  });

export default router;