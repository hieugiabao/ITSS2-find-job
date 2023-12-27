import dbConnect from "@/dbConnect";
import { creatComment, getCommnent } from "@/company.service";
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
        const { comment, proofUrl, status, company, anonymous, user } =
          req.body;

        const result = await creatComment({
          comment: comment as string,
          proofUrl: proofUrl as string,
          status: status as string,
          company: company as string,
          anonymous: Number(anonymous),
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
        const { id, page, size } = req.query;

        const result = await getCommnent(String(id));

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
