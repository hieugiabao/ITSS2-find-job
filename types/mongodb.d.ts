import { IAddress } from "../models/Address";
import { IApplyCv } from "../models/ApplyCv";
import { IApplyMentor } from "../models/ApplyMentor";
import { ICategory } from "../models/Category";
import { IComment } from "../models/Comment";
import { ICompany } from "../models/Company";
import { IJob } from "../models/Job";
import { ILike } from "../models/Like";
import { IPayment } from "../models/Payment";
import { IUser } from "../models/User";

declare module "mongoose" {
  export interface Models {
    User: Model<IUser>;
    Address: Model<IAddress>;
    Company: Model<ICompany>;
    Category: Model<ICategory>;
    Comment: Model<IComment>;
    Job: Model<IJob>;
    Like: Model<ILike>;
    Payment: Model<IPayment>;
    ApplyCv: Model<IApplyCv>;
    ApplyMentor: Model<IApplyMentor>;
  }
}
