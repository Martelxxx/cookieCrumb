//
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  profilePicture: {
    data: { type: mongoose.Schema.Types.Buffer },
    contentType: { type: String },
  }
});

const User = mongoose.model('User', UserSchema);

export default User;
