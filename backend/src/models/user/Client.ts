import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const clientProfileSchema = new Schema({
  firstName: { type: String, trim: true, required: true },
  lastName: { type: String, trim: true, required: true },
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

clientProfileSchema.pre("save", function (next) {
  let user = this;
  user.firstName = user.firstName.replace(/ /g, "")
  user.lastName = user.lastName.replace(/ /g, "")
  next()
})


// clientSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) return next();
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

export default clientProfileSchema;