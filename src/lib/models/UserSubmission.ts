import mongoose, { Schema, Document } from "mongoose";

export interface IUserSubmission extends Document {
  name: string;
  level: number;
  term: "I" | "II";
  dept: string;
  email: string;
  finalPassword?: string;
  completed: boolean;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSubmissionSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    level: {
      type: Number,
      required: true,
      min: 1,
      max: 4,
    },
    term: {
      type: String,
      required: true,
      enum: ["I", "II"],
    },
    dept: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    finalPassword: {
      type: String,
      default: "",
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure email is unique
UserSubmissionSchema.index({ email: 1 }, { unique: true });

export default mongoose.models.UserSubmission || mongoose.model<IUserSubmission>("UserSubmission", UserSubmissionSchema);
