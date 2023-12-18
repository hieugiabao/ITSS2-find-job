import Job, { IJob } from "../models/Job";
import { PageOption, PageResult } from "./../types/index";

type Filter = {
  query?: string;
  address?: string;
  industry?: string;
  experience?: string;
  salary?: string;
  company?: string;
};

async function getJobsPaginated(
  pageOption: PageOption,
  filter: Filter = {}
): Promise<PageResult<IJob> | null> {
  const { page, size } = pageOption;
  const { query, address, industry, experience, salary, company } = filter;

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
      $expr: { $eq: ["$address", parseInt(address)] },
    });
  }

  if (industry) {
    and.push({
      industry: parseInt(industry),
    });
  }
  if (experience) {
    const [min, max] = experience.split("-");
    and.push({
      experience: {
        $gte: parseInt(min),
        $lte: parseInt(max),
      },
    });
  }

  if (company) {
    and.push({
      $expr: { $eq: ["$company", { $toObjectId: company }] },
    });
  }

  if (salary) {
    const [min, max] = salary.split("-");
    and.push({
      salary: {
        $gte: parseInt(min) * 1e6,
        $lte: parseInt(max) * 1e6,
      },
    });
  }

  const results = await Job.aggregate([
    { $match: and.length > 0 ? { $and: and } : {} },
    {
      $lookup: {
        from: "addresses",
        localField: "address",
        foreignField: "_id",
        as: "address",
      },
    },
    { $unwind: "$address" },
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
        as: "company",
      },
    },
    { $unwind: "$company" },

    {
      $sort: {
        experience: -1,
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
    {
      $unwind: "$totalCount",
    },
    {
      $project: {
        results: 1,
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
      },
    },
  ]);

  return results.length > 0 ? results[0] : null;
}

async function getJobById(id: string): Promise<IJob | null> {
  const job = await Job.aggregate([
    { $match: { $expr: { $eq: ["$_id", { $toObjectId: id }] } } },
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
        as: "company",
      },
    },
    { $unwind: "$company" },
  ]);

  return job.length > 0 ? job[0] : null;
}

export { getJobById, getJobsPaginated };
