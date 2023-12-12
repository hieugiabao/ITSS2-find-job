import dbConnect from "@/dbConnect";
import { NextApiRequest, NextApiResponse } from "next";
import User, { UserRole } from "../../../models/User";

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
          l: location,
          ind: industry,
          exp: experience,
        } = req.query;
        let pageNumber = parseInt(<string>page ?? "1");
        let sizeNumber = parseInt(<string>size ?? "3");
        let and: any[] = [];

        and.push({ role: UserRole.MENTOR });

        if (query) {
          and.push({
            $or: [
              { firstName: { $regex: query, $options: "i" } },
              { lastName: { $regex: query, $options: "i" } },
              { description: { $regex: query, $options: "i" } },
              { email: { $regex: query, $options: "i" } },
              { fullName: { $regex: query, $options: "i" } },
            ],
          });
        }

        if (location) {
          and.push({
            address: parseInt(<string>location),
          });
        }

        if (industry) {
          and.push({
            category: parseInt(<string>industry),
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

        const mentors = await User.aggregate([
          {
            $addFields: {
              fullName: { $concat: ["$firstName", " ", "$lastName"] },
            },
          },
          { $match: { $and: and } },
          {
            $project: {
              password: 0,
              __v: 0,
            },
          },
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

        res.status(200).json({ success: true, data: mentors });
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
