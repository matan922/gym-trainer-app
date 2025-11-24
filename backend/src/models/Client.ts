import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const clientSchema = new Schema({
  trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer', required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  age: { type: Number, required: true },
  weight: { type: Number, required: true },
  goal: { type: String, required: true },
  notes: { type: String, required: true },
});

export default mongoose.model("Client", clientSchema);
