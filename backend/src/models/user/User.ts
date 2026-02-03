import mongoose from 'mongoose';
import trainerProfileSchema from './Trainer';
import clientProfileSchema from './Client';

const Schema = mongoose.Schema;

export interface IUser {
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  profiles: {
    trainer?: {
      trainerType: string;
    };
    client?: {
      age?: number;
      weight?: number;
      goal?: string;
      notes?: string;
      weightHistory?: Array<{ weight: number; date: Date }>;
      personalRecords?: Array<{ exercise: string; weight?: number; reps?: number; date: Date }>;
    };
  };
  activeProfile?: 'trainer' | 'client';
  createdAt: Date;
}

const userSchema = new Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  profiles: {
    trainer: { type: trainerProfileSchema, default: null },
    client: { type: clientProfileSchema, default: null }
  },
  activeProfile: {
    type: String,
    enum: ['trainer', 'client'],
    required: function () {
      // Only required if user has at least one profile
      return this.profiles.trainer || this.profiles.client;
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.pre("save", function (next) {
  let user = this;
  user.firstName = user.firstName.replace(/ /g, "")
  user.lastName = user.lastName.replace(/ /g, "")
  next()
})


export default mongoose.model<IUser>("User", userSchema);
