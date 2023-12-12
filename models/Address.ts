import mongoose from "mongoose";

export interface IAddress extends mongoose.Document<number> {
  name: string;
}

const AddressSchema = new mongoose.Schema<IAddress>({
  _id: {
    unique: true,
    type: Number,
    immutable: true,
    required: [true, "Please provide an id for this address."],
  },
  name: {
    type: String,
    unique: true,
    required: [true, "Please provide a name for this address."],
    maxlength: [60, "Name cannot be more than 60 characters"],
  },
});

export default mongoose.models.Address ||
  mongoose.model<IAddress>("Address", AddressSchema);
