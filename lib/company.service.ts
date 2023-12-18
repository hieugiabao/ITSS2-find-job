import Company, { ICompany } from "../models/Company";
import { PageOption, PageResult } from "./../types/index";

type Filter = {
  query?: string;
  address?: string;
  industry?: string;
};

async function getCompaniesPaginated(
  pageOption: PageOption,
  filter: Filter = {}
): Promise<PageResult<ICompany> | null> {
  const { page, size } = pageOption;
  const { query, address: location, industry } = filter;

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
      $project: {
        jobs: 0,
        __v: 0,
      },
    },
    {
      $sort: {
        jobsCount: -1, // Sort by jobsCount DESC
      },
    },
    {
      $facet: {
        results: [{ $skip: (page - 1) * size }, { $limit: size }],
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
              $gt: ["$totalCount.count", (page - 1) * size],
            },
            then: page,
            else: "$$REMOVE",
          },
        },
        size: {
          $cond: {
            if: {
              $gt: ["$totalCount.count", (page - 1) * size],
            },
            then: size,
            else: "$$REMOVE",
          },
        },
        totalPages: {
          $ceil: {
            $divide: ["$totalCount.count", size],
          },
        },
        totalCount: "$totalCount.count",
        results: 1,
      },
    },
  ]);

  return results.length > 0 ? results[0] : null;
}

export { getCompaniesPaginated };
