import mongoose from "mongoose";
import { ICompany } from "./Company";
import { IAddress } from "./Address";

export interface IJob extends mongoose.Document {
  title: string;
  description?: string;
  category: string;
  company: mongoose.Types.ObjectId | ICompany;
  address: mongoose.Types.ObjectId | IAddress;
  salary: number;
  experience: string;
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
    required: [true, "Please provide a company for this job."],
  },
  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
    required: [true, "Please provide an address for this job."],
  },
  salary: {
    type: Number,
    required: [true, "Please provide a salary for this job."],
  },
  experience: {
    type: String,
    required: [true, "Please provide an experience for this job."],
  },
});

export default mongoose.models.Job || mongoose.model<IJob>("Job", JobSchema);
