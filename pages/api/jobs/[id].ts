import dbConnect from "@/dbConnect";
import { NextApiRequest, NextApiResponse } from "next";
import Job from "../../../models/Job";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  const { method } = req;
  const { id } = req.query;

  switch (method) {
    case "GET":
      try {
       const job = await Job.aggregate([
        { $match: { $expr : { $eq: [ '$_id' , { $toObjectId: id } ] } } },
        {
          $lookup: {
            from: "addresses",
            localField: "address",
            foreignField: "_id",
            as: "location",
          },
        },
        { $unwind: "$location" },
        {
          $lookup: {
            from: "categories",
            localField: "industry",
            foreignField: "_id",
            as: "category",
          },
        },
        { $unwind: "$category" }, 
        {
          $lookup: {
            from: "companies",
            localField: "company",
            foreignField: "_id",
            as: "companyInfor",
          },
        },
        { $unwind: "$companyInfor" },
      ]);

        res.status(200).json({ success: true, data: job });
      } catch (error) {
        console.log(error);
        res.status(500).json({ success: false });
      }
      break;
    case "POST":
    case "PUT":
    case "DELETE":
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
