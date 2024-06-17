// Purpose: Define the Geolocation model schema and export it for use in other files.
import mongoose from 'mongoose';

const geolocationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

const Geolocation = mongoose.model('Geolocation', geolocationSchema);

export default Geolocation;