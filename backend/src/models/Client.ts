import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const clientSchema = new Schema({
  trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer', required: true },
  firstName: { type: String, trim: true, required: true },
  lastName: { type: String, trim: true, required: true },
  age: { type: Number, required: true },
  weight: { type: Number, required: true },
  goal: { type: String, required: true },
  notes: { type: String, required: true, trim: true },
  // email: { type: String, trim: true, required: true, unique: true },
  // password: { type: String, required: true },
  isActive: {type: Boolean, default: false},
  emailVerified: { type: Boolean, default: false },
});

clientSchema.pre("save", function (next) {
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

export default mongoose.model("Client", clientSchema);
