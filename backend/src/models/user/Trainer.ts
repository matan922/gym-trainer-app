import mongoose from "mongoose";

const Schema = mongoose.Schema;

const trainerProfileSchema = new Schema({
  trainerType: {
    type: String,
    required: true
  }
}, { _id: false }); // _id: false means this subdocument won't get its own _id


export default trainerProfileSchema;