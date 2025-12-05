import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const emailVerificationToken = new Schema({
  token: {
    type: String,
    required: true,
    unique: true
  },
  trainerId: {
    type: Schema.Types.ObjectId,
    ref: 'Trainer',
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for automatic cleanup of expired tokens
emailVerificationToken.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('EmailVerificationToken', emailVerificationToken);
