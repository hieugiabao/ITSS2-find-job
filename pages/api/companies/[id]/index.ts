import dbConnect from "@/dbConnect";
import { getDetailCompany } from "@/company.service";
import { NextApiRequest, NextApiResponse } from "next";

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
        const company = await getDetailCompany(id as string);

        res.status(200).json({ success: true, data: company });
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
