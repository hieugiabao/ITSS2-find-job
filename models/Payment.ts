import mongoose from "mongoose";
import { IUser } from "./User";

export interface IPayment extends mongoose.Document {
  price: number;
  date: Date;
  user: mongoose.Types.ObjectId | IUser;
}

const PaymentSchema = new mongoose.Schema<IPayment>({
  price: {
    type: Number,
    required: [true, "Please provide a price for this payment."],
  },
  date: {
    type: Date,
    required: [true, "Please provide a date for this payment."],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide a user for this payment."],
  },
});

export default mongoose.models.Payment ||
  mongoose.model<IPayment>("Payment", PaymentSchema);
