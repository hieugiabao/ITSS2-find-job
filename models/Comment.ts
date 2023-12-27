import mongoose from "mongoose";
import { IUser } from "./User";
import { ICompany } from "./Company";

export interface IComment extends mongoose.Document {
  comment: string;
  proofUrl: string;
  status: string;
  company: mongoose.Types.ObjectId | ICompany;
  anonymous: number;
  user?: mongoose.Types.ObjectId | IUser | null;
}

const CommentSchema = new mongoose.Schema<IComment>({
  comment: {
    type: String,
    required: [true, "Please provide a comment."],
  },
  proofUrl: {
    type: String,
  },
  status: {
    type: String,
    required: [true, "Please provide a status for this comment."],
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    alias: "companyId",
  },
  anonymous: {
    type: Number,
    required: false,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "User",
    alias: "userId",
  },
});

export default mongoose.models.Comment ||
  mongoose.model<IComment>("Comment", CommentSchema);
