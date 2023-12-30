import Company, { ICompany } from "../models/Company";
import Comment, { IComment } from "../models/Comment";
import { PageOption, PageResult } from "./../types/index";
import Like, { ILike } from "../models/Like";
import "../models/User";

type Filter = {
  query?: string;
  address?: string;
  industry?: string;
};
type CommentType = {
  comment?: string;
  proofUrl?: string;
  status?: string;
  company?: string;
  anonymous?: number;
  user?: string;
};
type LikeType = {
  company?: string;
  user?: string;
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
      $expr: { $eq: ["$location", parseInt(location)] },
    });
  }

  if (industry) {
    and.push({
      $expr: { $eq: ["$category", parseInt(industry)] },
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

async function getDetailCompany(id: string): Promise<ICompany | null> {
  const company = await Company.aggregate([
    { $match: { $expr: { $eq: ["$_id", { $toObjectId: id }] } } },
    {
      $lookup: {
        from: "addresses",
        localField: "location",
        foreignField: "_id",
        as: "location",
      },
    },
    { $unwind: "$location" },
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    { $unwind: "$category" },
    {
      $lookup: {
        from: "jobs",
        localField: "_id",
        foreignField: "company",
        as: "jobs",
      },
    },
  ]);

  return company.length > 0 ? company[0] : null;
}

async function creatComment(
  commentType: CommentType = {}
): Promise<IComment | null> {
  const result = await Comment.create(commentType);
  return result.populate("user");
}
async function getCommnent(id: string): Promise<IComment[]> {
  const comments = await Comment.aggregate<IComment>([
    { $match: { $expr: { $eq: ["$company", { $toObjectId: id }] } } },
    { $sort: { createdAt: -1 } },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
  ]);

  return comments ?? [];
}
async function creatLike(likeType: LikeType = {}): Promise<ILike | null> {
  const like = await Like.aggregate([
    {
      $match: {
        $and: [
          { $expr: { $eq: ["$user", { $toObjectId: likeType.user }] } },
          { $expr: { $eq: ["$company", { $toObjectId: likeType.company }] } },
        ],
      },
    },
  ]);
  if (like.length > 0) {
    await Like.deleteOne(likeType);
    return null;
  } else {
    const result = await Like.create(likeType);
    return result;
  }
}

async function getTotalLike(id: string): Promise<ILike | null> {
  const totalLike = await Like.aggregate([
    {
      $match: {
        $expr: { $eq: ["$company", { $toObjectId: id }] },
      },
    },
    {
      $count: "totalLike",
    },
  ]);

  return totalLike.length > 0 ? totalLike[0] : null;
}

async function checkIsLike(
  companyId: string,
  userId: string
): Promise<boolean> {
  const totalLike = await Like.exists({
    company: companyId,
    user: userId,
  });

  return !!totalLike?._id;
}

export {
  getCompaniesPaginated,
  getDetailCompany,
  creatComment,
  getCommnent,
  creatLike,
  getTotalLike,
  checkIsLike,
};
