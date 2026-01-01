import mongoose from "mongoose";

const Schema = mongoose.Schema;

const trainerProfileSchema = new Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
}, { _id: false }); // _id: false means this subdocument won't get its own _id


export default trainerProfileSchema;


// const trainerSchema = new mongoose.Schema({
//   firstName: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   lastName: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     lowercase: true
//   },
//   password: {
//     type: String,
//     required: true,
//     minlength: 6
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   },
//   emailVerified: {
//     type: Boolean,
//     default: false,
//   }
// });
