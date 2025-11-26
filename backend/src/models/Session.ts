import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const sessionSchema = new Schema({
  trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer', required: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  createdAt: { type: Date, default: Date.now, required: true },
  sessionDate: {type: Date, required: true},
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  sessionType: { type: String, required: true, enum: ["Studio", "Online"] },
  status: { type: String, required: true, enum: ["Scheduled", "Completed", "Cancelled"] } // (studio, online),
});

export default mongoose.model("Session", sessionSchema);
