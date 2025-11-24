import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
    name: { type: String, required: true },
    sets: { type: Number, required: true },
    reps: { type: Number, required: true },
    rest: { type: Number, required: true }
});

const workoutSchema = new Schema({
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
    date: Date,
    notes: String,
    exercises: [exerciseSchema]
});


export default mongoose.model("Workout", workoutSchema);
