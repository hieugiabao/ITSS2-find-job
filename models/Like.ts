import mongoose from "mongoose";
import { IUser } from "./User";
import { ICompany } from "./Company";

export interface ILike extends mongoose.Document {
  user: mongoose.Types.ObjectId | IUser;
  company: ICompany;
}

const LikeSchema = new mongoose.Schema<ILike>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    alias: "userId",
    required: [true, "Please provide a user for this like."],
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    alias: "companyId",
    required: [true, "Please provide a company for this like."],
  },
});

export default mongoose.models.Like ||
  mongoose.model<ILike>("Like", LikeSchema);
