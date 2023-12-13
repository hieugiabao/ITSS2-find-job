import dbConnect from "@/dbConnect";
import { NextApiRequest, NextApiResponse } from "next";
import Job from "../../../models/Job";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const {
          page,
          size,
          q: query,
          add: address,
          ind: industry,
          exp: experience,
          sal: salary
        } = req.query;
        let pageNumber = parseInt(<string>page ?? "1");
        let sizeNumber = parseInt(<string>size ?? "3");
        let and: any[] = [];


        if (query) {
          and.push({
            $or: [
              { title: { $regex: query, $options: "i" } },
              { description: { $regex: query, $options: "i" } },
              
            ],
          });
        }

        if (address) {
            and.push({
                $expr: { $eq: ["$address", parseInt(address as string)] },
              });
        }

        if (industry) {
            and.push({
                industry: parseInt(<string>industry),
              });
       
        }
        if (experience) {
            const [min, max] = (<string>experience).split("-");
            and.push({
              experience: {
                $gte: parseInt(min),
                $lte: parseInt(max),
              },
            });
          }

        if (salary) {
          const [min, max] = (<string>salary).split("-");
          and.push({
            salary: {
              $gte: parseInt(min),
              $lte: parseInt(max),
            },
          });
         
        }

        const jobs = await Job.aggregate([
          {  $match: and.length > 0 ? { $and: and } : {} },
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
         
          {
            $sort: {
              experience: -1,
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
          {
            $unwind: "$totalCount",
          },
          {
            $project: {
              results: 1,
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
            },
          },
        ]);

        res.status(200).json({ success: true, data: jobs });
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