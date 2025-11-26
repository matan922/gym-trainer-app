import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const clientSchema = new Schema({
  trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer', required: true },
  firstName: { type: String, trim: true, required: true },
  lastName: { type: String, trim: true, required: true },
  age: { type: Number, required: true },
  weight: { type: Number, required: true },
  goal: { type: String, required: true },
  notes: { type: String, required: true },
});

clientSchema.pre("save", function (next) {
  let user = this;
  user.firstName = user.firstName.replace(/ /g, "")
  user.lastName = user.lastName.replace(/ /g, "")
  next()
})

export default mongoose.model("Client", clientSchema);
