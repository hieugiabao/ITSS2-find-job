import mongoose from "mongoose";
import { IJob } from "./Job";
import { IUser } from "./User";

export enum ApplyCvStatus {
  PENDING = 0,
  APPROVED = 1,
  REJECTED = 2,
}

export interface IApplyCv extends mongoose.Document {
  description?: string;
  cvUrl: string;
  email: string;
  job: mongoose.Types.ObjectId | IJob;
  user: mongoose.Types.ObjectId | IUser;
  status: ApplyCvStatus;
}

const ApplyCvSchema = new mongoose.Schema<IApplyCv>({
  description: {
    type: String,
  },
  cvUrl: {
    type: String,
    required: [true, "Please provide a cv url for this apply cv."],
  },
  email: {
    type: String,
    required: [true, "Please provide an email for this apply cv."],
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: [true, "Please provide a job for this apply cv."],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide a user for this apply cv."],
  },
  status: {
    type: Number,
    enum: [0, 1, 2],
    default: ApplyCvStatus.PENDING,
  },
});

export default mongoose.models.ApplyCv ||
  mongoose.model<IApplyCv>("ApplyCv", ApplyCvSchema);
