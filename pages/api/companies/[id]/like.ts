import dbConnect from "@/dbConnect";
import { creatLike, getTotalLike } from "@/company.service";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  const { method } = req;

  switch (method) {
    case "POST":
      try {
        const { user, company } = req.body;

        const result = await creatLike({
          company: company as string,
          user: user as string,
        });

        res.status(200).json({
          success: true,
          data: result,
        });
      } catch (error) {
        console.log(error);
        res.status(500).json({ success: false });
      }
      break;
    case "GET":
      try {
        const { id } = req.query;

        const result = await getTotalLike(String(id));

        res.status(200).json({
          success: true,
          data: result,
        });
      } catch (error) {
        console.log(error);
        res.status(500).json({ success: false });
      }
      break;

    case "PUT":
    case "DELETE":
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
