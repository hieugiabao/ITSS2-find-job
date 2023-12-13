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
  firstName?: string;
  lastName?: string;
  address?: number | IAddress | null;
  company?: mongoose.Types.ObjectId | ICompany | null;
  category?: number | ICategory | null;
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
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  address: {
    type: Number,
    alias: "addressId",
    ref: "Address",
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    alias: "companyId",
    ref: "Company",
  },
  category: {
    type: Number,
    alias: "categoryId",
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
