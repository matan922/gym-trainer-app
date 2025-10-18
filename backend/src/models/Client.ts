import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
  name: {type: String, required: true},
  sets: {type: Number, required: true},
  reps: {type: Number, required: true},
  rest: {type: Number, required: true}
});

const workoutSchema = new Schema({
  date: Date,
  notes: String,
  exercises: [exerciseSchema]
});

const clientSchema = new Schema({
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  age: {type: Number, required: true},
  weight: {type: Number, required: true},
  goal: {type: String, required: true},
  notes: {type: String, required: true},
  workouts: [workoutSchema]
});

export default mongoose.model("Client", clientSchema);
