import dbConnect from "@/dbConnect";
import { getMentorsPaginated } from "@/user.service";
import { NextApiRequest, NextApiResponse } from "next";

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
        const result = await getMentorsPaginated(
          {
            page: pageNumber,
            size: sizeNumber,
          },
          {
            query: query as string,
            location: location as string,
            industry: industry as string,
            experience: experience as string,
          }
        );

        res.status(200).json({
          success: true,
          data: result ?? {
            results: [],
            page: 0,
            size: 0,
            totalPages: 0,
            totalCount: 0,
          },
        });
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
