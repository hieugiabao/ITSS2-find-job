import Comment from "../models/Comment";
import { ICompany } from "../models/Company";
import Like from "../models/Like";
import User, { IUser, UserRole } from "../models/User";
import { PageOption, PageResult } from "../types";

type MentorFilter = {
  query?: string;
  location?: string;
  industry?: string;
  experience?: string;
};
type UserType = {
  firstName?: string;
  lastName?: string;
  address?: number;
  description?: string;
  avatarUrl?: string;
};

async function getMentorsPaginated(
  pageOption: PageOption,
  filter: MentorFilter = {}
): Promise<PageResult<IUser> | null> {
  const { query, location, industry, experience } = filter;
  const { page, size } = pageOption;
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
      address: parseInt(location),
    });
  }

  if (industry) {
    and.push({
      category: parseInt(industry),
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

  const results = await User.aggregate([
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

async function getMentorById(id: string): Promise<IUser | null> {
  const result = await User.aggregate<IUser>([
    {
      $addFields: {
        fullName: { $concat: ["$firstName", " ", "$lastName"] },
      },
    },
    {
      $match: {
        $and: [
          { $expr: { $eq: ["$_id", { $toObjectId: id }] } },
          { role: UserRole.MENTOR },
        ],
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $unwind: "$category",
    },
    {
      $lookup: {
        from: "addresses",
        localField: "address",
        foreignField: "_id",
        as: "address",
      },
    },
    {
      $unwind: "$address",
    },
    {
      $lookup: {
        from: "users",
        localField: "category",
        foreignField: "category",
        pipeline: [
          {
            $match: {
              $and: [
                { $expr: { $ne: ["$_id", { $toObjectId: id }] } },
                { role: UserRole.MENTOR },
              ],
            },
          },
        ],
        as: "suggestMentors",
      },
    },
    {
      $project: {
        password: 0,
        __v: 0,
      },
    },
  ]);

  return result.length > 0 ? result[0] : null;
}
async function getUserById(id: string): Promise<IUser | null> {
  const result = await User.aggregate<IUser>([
    {
      $addFields: {
        fullName: { $concat: ["$firstName", " ", "$lastName"] },
      },
    },
    {
      $match: {
        $expr: { $eq: ["$_id", { $toObjectId: id }] },
      },
    },
    {
      $lookup: {
        from: "addresses",
        localField: "address",
        foreignField: "_id",
        as: "address",
      },
    },
    {
      $unwind: "$address",
    },
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $unwind: "$category",
    },
    {
      $project: {
        password: 0,
        __v: 0,
      },
    },
  ]);

  return result.length > 0 ? result[0] : null;
}
async function updateUser(
  id: string,
  userInfo: UserType = {}
): Promise<IUser | null> {
  const result = await User.findByIdAndUpdate(
    { _id: id },
    {
      $set: {
        ...userInfo,
      },
    },
    { upsert: true, new: true }
  ).exec();

  return result;
}

async function getLikedCompaniesByUserId(id: string): Promise<ICompany[]> {
  const results = await Like.aggregate([
    {
      $match: {
        $expr: { $eq: ["$user", { $toObjectId: id }] },
      },
    },
    {
      $lookup: {
        from: "companies",
        localField: "company",
        foreignField: "_id",
        as: "company",
      },
    },
    {
      $unwind: "$company",
    },
    // make result a single array
    {
      $group: {
        _id: null,
        companies: {
          $push: "$company",
        },
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
  ]);

  return results.length > 0 ? results[0].companies : [];
}

async function getCommentedCompaniesByUserId(id: string): Promise<ICompany[]> {
  const results = await Comment.aggregate([
    {
      $match: {
        $and: [{ $expr: { $eq: ["$user", { $toObjectId: id }] } }],
      },
    },
    {
      $lookup: {
        from: "companies",
        localField: "company",
        foreignField: "_id",
        as: "company",
      },
    },
    {
      $unwind: "$company",
    },
    // make result a single array
    {
      $group: {
        _id: null,
        companies: {
          $push: "$company",
        },
      },
    },
    // make data is unique with the same company
    {
      $project: {
        companies: {
          $reduce: {
            input: "$companies",
            initialValue: [],
            in: {
              $cond: {
                if: {
                  $in: ["$$this", "$$value"],
                },
                then: "$$value",
                else: {
                  $concatArrays: ["$$value", ["$$this"]],
                },
              },
            },
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
  ]);

  return results.length > 0 ? results[0].companies : [];
}

export {
  getMentorsPaginated,
  getMentorById,
  getUserById,
  updateUser,
  getLikedCompaniesByUserId,
  getCommentedCompaniesByUserId,
};
