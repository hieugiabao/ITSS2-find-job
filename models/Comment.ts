import mongoose from "mongoose";
import { IUser } from "./User";

export interface IComment extends mongoose.Document {
  comment: string;
  proofUrl: string;
  status: string;
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
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

export default mongoose.models.Comment ||
  mongoose.model<IComment>("Comment", CommentSchema);
