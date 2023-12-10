import mongoose from "mongoose";

export interface ICategory extends mongoose.Document {
  name: string;
}

const CategorySchema = new mongoose.Schema<ICategory>({
  name: {
    type: String,
    required: [true, "Please provide a name for this category."],
  },
});

export default mongoose.models.Category ||
  mongoose.model<ICategory>("Category", CategorySchema);
