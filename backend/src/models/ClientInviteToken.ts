import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const clientInviteToken = new Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    userTrainerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    clientEmail: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    usedAt: {
        type: Date,
    }
});

// Index for automatic cleanup of expired tokens
clientInviteToken.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });


export default mongoose.model('ClientInviteToken', clientInviteToken);
