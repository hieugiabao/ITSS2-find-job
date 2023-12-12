import mongoose from "mongoose";
import { ICategory } from "./Category";
import { IAddress } from "./Address";

export interface ICompany extends mongoose.Document {
  companyName: string;
  address: string;
  description?: string;
  avatarUrl?: string;
  category?: number | ICategory;
  location?: number | IAddress;
}

const CompanySchema = new mongoose.Schema<ICompany>({
  companyName: {
    type: String,
    required: [true, "Please provide a name for this company."],
  },
  address: {
    type: String,
    required: [true, "Please provide an address for this company."],
  },
  description: {
    type: String,
  },
  avatarUrl: {
    type: String,
  },
  category: {
    type: Number,
    ref: "Category",
    alias: "categoryId",
  },
  location: {
    type: Number,
    ref: "Address",
    alias: "addressId",
  },
});

export default mongoose.models.Company ||
  mongoose.model<ICompany>("Company", CompanySchema);
