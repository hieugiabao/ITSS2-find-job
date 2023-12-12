import dotenv from "dotenv";
dotenv.config({
  path: ".env.local",
});
import mongoose from "mongoose";
import dbConnect from "../lib/dbConnect";
import Company from "../models/Company";
import "../models/Category";
import "../models/Address";

async function main() {
  await dbConnect();

  const companies = await Company.find({}).populate("category location");
  console.log(companies);
  await mongoose.disconnect();
}

main();
