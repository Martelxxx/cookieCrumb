// Purpose: Define the Geolocation model schema and export it for use in other files.
import mongoose from 'mongoose';

const GeolocationSchema = new mongoose.Schema({
  username: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Add this field
});

const Geolocation = mongoose.model('Geolocation', GeolocationSchema);

export default Geolocation;
