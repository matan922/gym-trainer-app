import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const sessionSchema = new Schema({
  trainerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  clientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  workoutId: { type: Schema.Types.ObjectId, ref: 'Workout' },
  createdAt: { type: Date, default: Date.now, required: true },
  sessionDate: { type: Date, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  sessionType: { type: String, required: true, enum: ["Studio", "Online"] },
  workoutName: { type: String },
  status: { type: String, required: true, enum: ["Scheduled", "Completed", "Cancelled"] }

});


export default mongoose.model("Session", sessionSchema);
