import mongoose from "mongoose";
import { IUser } from "./User";

export enum ApplyMentorStatus {
  PENDING = 0,
  APPROVED = 1,
  REJECTED = 2,
}

export interface IApplyMentor extends mongoose.Document {
  user: mongoose.Types.ObjectId | IUser;
  mentor: mongoose.Types.ObjectId | IUser;
  status: string;
  description?: string;
  cvUrl: string;
  email: string;
}

const ApplyMentorSchema = new mongoose.Schema<IApplyMentor>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    alias: "userId",
    required: [true, "Please provide a user for this apply mentor."],
  },
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    alias: "mentorId",
    required: [true, "Please provide a mentor for this apply mentor."],
  },
  status: {
    type: String,
    required: [true, "Please provide a status for this apply mentor."],
  },
  description: {
    type: String,
  },
  cvUrl: {
    type: String,
    required: [true, "Please provide a cv url for this apply mentor."],
  },
  email: {
    type: String,
    required: [true, "Please provide an email for this apply mentor."],
  },
});

export default mongoose.models.ApplyMentor ||
  mongoose.model<IApplyMentor>("ApplyMentor", ApplyMentorSchema);
