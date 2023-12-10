import mongoose from "mongoose";

export interface IAddress extends mongoose.Document {
  name: string;
}

const AddressSchema = new mongoose.Schema<IAddress>({
  name: {
    type: String,
    required: [true, "Please provide a name for this address."],
    maxlength: [60, "Name cannot be more than 60 characters"],
  },
});

export default mongoose.models.Address ||
  mongoose.model<IAddress>("Address", AddressSchema);
