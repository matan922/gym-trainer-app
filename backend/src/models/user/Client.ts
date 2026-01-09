import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const clientProfileSchema = new Schema({
  age: { type: Number },
  weight: { type: Number },
  goal: { type: String, trim: true },
  notes: { type: String, trim: true },
  weightHistory: [{
    weight: { type: Number, required: true },
    date: { type: Date, required: true, default: Date.now }
  }],

  personalRecords: [{
    exercise: { type: String, required: true },
    weight: { type: Number },
    reps: { type: Number },
    date: { type: Date, required: true, default: Date.now }
  }]
}, { _id: false });



// clientSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) return next();
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

export default clientProfileSchema;