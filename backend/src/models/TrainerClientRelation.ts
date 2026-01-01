import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const trainerClientRelationSchema = new Schema({
    trainerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    clientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['active', 'pending', 'ended'], required: true, default: 'pending' },
    createdAt: { type: Date, default: Date.now() },
    endedAt: { type: Date },
})

trainerClientRelationSchema.index({ trainerId: 1, status: 1 });
trainerClientRelationSchema.index({ clientId: 1, status: 1 });
trainerClientRelationSchema.index({ trainerId: 1, clientId: 1 }, { unique: true });

export default mongoose.model('TrainerClientRelationship', trainerClientRelationSchema)