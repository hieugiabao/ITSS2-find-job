import dbConnect from "@/dbConnect";
import { NextApiRequest, NextApiResponse } from "next";
import Company from "../../../models/Company";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const { page, size, q: query, l: location, ind: industry } = req.query;
        let pageNumber = parseInt((page as string) ?? "1");
        let sizeNumber = parseInt((size as string) ?? "3");
        let and: any[] = [];

        if (query) {
          and.push({
            $or: [
              { companyName: { $regex: query, $options: "i" } },
              { description: { $regex: query, $options: "i" } },
            ],
          });
        }

        if (location) {
          and.push({
            $expr: { $eq: ["$location", parseInt(location as string)] },
          });
        }

        if (industry) {
          and.push({
            $expr: { $eq: ["$category", parseInt(industry as string)] },
          });
        }

        const results = await Company.aggregate([
          {
            $match: and.length > 0 ? { $and: and } : {},
          },
          {
            $lookup: {
              from: "addresses",
              localField: "location",
              foreignField: "_id",
              as: "location",
            },
          },
          { $unwind: "$location" }, // Convert array to object
          {
            $lookup: {
              from: "categories",
              localField: "category",
              foreignField: "_id",
              as: "category",
            },
          },
          { $unwind: "$category" }, // Convert array to object
          {
            $lookup: {
              from: "jobs",
              localField: "_id",
              foreignField: "company",
              as: "jobs",
            },
          },
          {
            $addFields: {
              jobsCount: { $size: "$jobs" },
            },
          },
          {
            $sort: {
              jobsCount: -1, // Sort by jobsCount DESC
            },
          },
          {
            $facet: {
              results: [
                { $skip: (pageNumber - 1) * sizeNumber },
                { $limit: sizeNumber },
              ],
              totalCount: [
                {
                  $count: "count",
                },
              ],
            },
          },
          { $unwind: "$totalCount" },
          {
            $project: {
              page: {
                $cond: {
                  if: {
                    $gt: ["$totalCount.count", (pageNumber - 1) * sizeNumber],
                  },
                  then: pageNumber,
                  else: "$$REMOVE",
                },
              },
              size: {
                $cond: {
                  if: {
                    $gt: ["$totalCount.count", (pageNumber - 1) * sizeNumber],
                  },
                  then: sizeNumber,
                  else: "$$REMOVE",
                },
              },
              totalPages: {
                $ceil: {
                  $divide: ["$totalCount.count", sizeNumber],
                },
              },
              totalCount: "$totalCount.count",
              results: 1,
            },
          },
        ]);

        res.status(200).json({
          success: true,
          data: results[0] ?? {
            results: [],
            page: 0,
            size: 0,
            totalPages: 0,
            totalCount: 0,
          },
        });
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
