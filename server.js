import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import methodOverride from 'method-override';
import morgan from 'morgan';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import User from './models/user.js';
import geolocationRoutes from './src/Routes/geolocation.js'; // Ensure this path is correct and matches the file location

const app = express();
const port = process.env.PORT || 3015;

// Define __filename and __dirname to use ES6 modules with CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

mongoose.connection.on("error", (err) => {
  console.error(`Error connecting to MongoDB: ${err.message}`);
});

// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// Middleware for using HTTP verbs such as PUT or DELETE
app.use(methodOverride("_method"));
// Morgan for logging HTTP requests
app.use(morgan('dev'));
// Cors
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: 'sessions'
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Endpoint to upload a file
app.post('/upload', upload.single('profilePicture'), async (req, res) => {
    console.log('Upload route called');
    if (!req.session.user) {
        console.log('Unauthorized access attempt');
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        console.log('File received:', req.file); // Log the file received

        if (!req.file) {
            console.log('No file uploaded');
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const user = await User.findById(req.session.user.id);
        if (!user) {
            console.log('User not found');
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('Uploaded file buffer:', req.file.buffer);
        console.log('Uploaded file mimetype:', req.file.mimetype);

        user.profilePicture = {
            data: req.file.buffer,
            contentType: req.file.mimetype,
        };
        await user.save();

        console.log('Profile picture uploaded successfully');
        res.status(200).json({ message: 'Profile picture uploaded successfully' });
    } catch (error) {
        console.error('Error uploading profile picture:', error);
        res.status(500).json({ message: 'Failed to upload profile picture', error: error.message });
    }
});

// Static route to serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Register route
app.post('/register', async (req, res) => {
  console.log('from server', req.body);
  const { username, firstName, lastName, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, firstName, lastName });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(`Error registering user: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to get user data
app.get('/user', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const user = await User.findById(req.session.user.id).select('firstName lastName username profilePicture');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userData = user.toObject();
        if (userData.profilePicture && userData.profilePicture.data) {
            userData.profilePicture.data = userData.profilePicture.data.toString('base64');
        }
        res.status(200).json(userData);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch user data', error: error.message });
    }
});

app.put('/update', async (req, res) => {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    const { username, firstName, lastName, password, confirmPassword } = req.body;
  
    if (password && password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }
  
    try {
      const user = await User.findById(req.session.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (username) {
        user.username = username;
      }
      if (firstName) {
        user.firstName = firstName;
      }
      if (lastName) {
        user.lastName = lastName;
      }
      if (password) {
        user.password = await bcrypt.hash(password, 10);
      }
  
      await user.save();
  
      // Update session user
      req.session.user.username = user.username;
      req.session.user.firstName = user.firstName;
      req.session.user.lastName = user.lastName;
  
      res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
      console.error(`Error updating user: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  });

  // Delete user profile picture route
app.delete('/delete', async (req, res) => {
    const { username } = req.body;
  
    if (!req.session.user || req.session.user.username !== username) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      user.profilePicture = null;
      await user.save();
  
      res.status(200).json({ message: 'Profile picture removed successfully' });
    } catch (error) {
      console.error('Error deleting profile picture:', error);
      res.status(500).json({ message: 'Failed to remove profile picture', error: error.message });
    }
  });


// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid username or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid username or password' });
    }

    req.session.user = { id: user._id, username: user.username, firstName: user.firstName, lastName: user.lastName };
    res.status(200).json({ success: true, message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Logout route
app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error(`Error during logout: ${err.message}`);
      return res.status(500).json({ error: err.message });
    }
    res.clearCookie('connect.sid');
    res.status(200).json({ message: 'Logout successful' });
  });
});

// Use the geolocation routes
app.use('/api', geolocationRoutes);

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
