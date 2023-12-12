import mongoose from "mongoose";

export interface ICategory extends mongoose.Document<number> {
  name: string;
}

const CategorySchema = new mongoose.Schema<ICategory>({
  _id: {
    unique: true,
    type: Number,
    immutable: true,
    required: [true, "Please provide an id for this category."],
  },
  name: {
    type: String,
    required: [true, "Please provide a name for this category."],
  },
});

export default mongoose.models.Category ||
  mongoose.model<ICategory>("Category", CategorySchema);
