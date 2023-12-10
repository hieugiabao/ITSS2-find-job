import mongoose from "mongoose";
import { IAddress } from "./Address";
import { ICompany } from "./Company";
import { ICategory } from "./Category";

export enum UserRole {
  ADMIN = 1,
  USER = 2,
  MENTOR = 3,
  HR = 4,
}

export interface IUser extends mongoose.Document {
  username: string;
  avatarUrl?: string;
  email: string;
  password: string;
  address?: mongoose.Types.ObjectId | IAddress | null;
  company?: mongoose.Types.ObjectId | ICompany | null;
  category?: mongoose.Types.ObjectId | ICategory | null;
  description?: string;
  level?: string;
  experience?: number;
  role: UserRole;
}

const UserSchema = new mongoose.Schema<IUser>({
  username: {
    type: String,
    required: [true, "Please provide a username."],
    unique: true,
  },
  avatarUrl: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "Please provide an email."],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password."],
  },
  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  description: {
    type: String,
  },
  level: {
    type: String,
  },
  experience: {
    type: Number,
  },
  role: {
    type: Number,
    enum: [1, 2, 3, 4],
    default: UserRole.USER,
  },
});

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
