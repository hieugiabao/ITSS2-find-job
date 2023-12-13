import mongoose from "mongoose";
import { ICompany } from "./Company";
import { IAddress } from "./Address";
import { ICategory } from "./Category";

export interface IJob extends mongoose.Document {
  title: string;
  description?: string;
  category: string;
  company: mongoose.Types.ObjectId | ICompany;
  address: number | IAddress;
  industry: number | ICategory;
  salary: number;
  experience: Number;
}

const JobSchema = new mongoose.Schema<IJob>({
  title: {
    type: String,
    required: [true, "Please provide a title for this job."],
  },
  description: {
    type: String,
  },
  category: {
    type: String,
    required: [true, "Please provide a category for this job."],
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    alias: "companyId",
    required: [true, "Please provide a company for this job."],
  },
  address: {
    type: Number,
    ref: "Address",
    alias: "addressId",
    required: [true, "Please provide an address for this job."],
  },
  salary: {
    type: Number,
    required: [true, "Please provide a salary for this job."],
  },
  experience: {
    type: Number,
    required: [true, "Please provide an experience for this job."],
  },
  industry: {
    type: Number,
    ref: "Category",
    alias: "categoryId",
    required: [true, "Please provide an industry for this job."],
  },
});

export default mongoose.models.Job || mongoose.model<IJob>("Job", JobSchema);
