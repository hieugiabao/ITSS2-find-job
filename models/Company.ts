import mongoose from "mongoose";

export interface ICompany extends mongoose.Document {
  companyName: string;
  address: string;
  description?: string;
  avatarUrl?: string;
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
});

export default mongoose.models.Company ||
  mongoose.model<ICompany>("Company", CompanySchema);
