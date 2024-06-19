import express from 'express';
import multer from 'multer';
import path from 'path';
import User from '../../models/user.js';
import { fileURLToPath } from 'url';


const router = express.Router();

// Define __filename and __dirname to use ES6 modules with CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
    });

const upload = multer({ storage });

const authenticateUser = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
}

// Endpoint to upload a file
router.post('/upload', upload.single('profilePicture'), authenticateUser, async (req, res) => {
    console.log('Upload route called');
    try {
      console.log('File received:', req.file); // Log the file received
      console.log('Request body:', req.body); // Log the request body
  
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
router.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  // Delete user profile picture route
router.delete('/delete', authenticateUser, async (req, res) => {
    const { username } = req.body;
  
    if (req.session.user.username !== username) {
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

export default router;