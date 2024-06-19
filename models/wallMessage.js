import mongoose from 'mongoose';

const wallMessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  username: { type: String, required: true }, // sender's username
//   recipientUsername: { type: String, required: true }, // recipient's username
  timestamp: { type: Date, default: Date.now }
});

const WallMessage = mongoose.model('WallMessage', wallMessageSchema);

export default WallMessage;