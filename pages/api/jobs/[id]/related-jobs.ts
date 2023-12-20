import dbConnect from "@/dbConnect";
import { getRelatedJobById } from "@/job.service";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  const { method } = req;
  const { id, size } = req.query;

  switch (method) {
    case "GET":
      try {
        const sizeNumber = parseInt((size as string) ?? "2");
        const relatedJobs = await getRelatedJobById(id as string, sizeNumber);

        res.status(200).json({ success: true, data: relatedJobs });
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
