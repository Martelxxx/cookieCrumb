import express from 'express';
import User from '../models/user.js';
import bcrypt from 'bcrypt';

const router = express.Router();

// POST /auth/sign-up - Sign up route
router.post('/sign-up', async (req, res) => {
  try {
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (userInDatabase) {
      return res.status(400).json({ message: 'Username already taken.' });
    }
    if (req.body.password !== req.body.confirmPassword) {
      return res.status(400).json({ message: 'Password and Confirm Password must match' });
    }
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    req.body.password = hashedPassword;
    const user = await User.create(req.body);
    res.status(201).json({ message: `Form Submission Accepted, ${user.username}!` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /auth/sign-in - Login route
router.post('/sign-in', async (req, res) => {
  try {
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (!userInDatabase) {
      return res.status(400).json({ message: 'Login failed. Please try again.' });
    }
    const validPassword = bcrypt.compareSync(req.body.password, userInDatabase.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Login failed. Please try again.' });
    }
    req.session.user = { username: userInDatabase.username };
    res.status(200).json({ message: 'Login successful', user: req.session.user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /auth/sign-out - Logout route
router.get('/sign-out', (req, res) => {
  req.session.destroy();
  res.status(200).json({ message: 'Logout successful' });
});

export default router;
