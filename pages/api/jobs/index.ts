import dbConnect from "@/dbConnect";
import { getJobsPaginated } from "@/job.service";
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
          add: address,
          ind: industry,
          exp: experience,
          sal: salary,
          com: company,
        } = req.query;
        let pageNumber = parseInt(<string>page ?? "1");
        let sizeNumber = parseInt(<string>size ?? "9");

        const result = await getJobsPaginated(
          {
            page: pageNumber,
            size: sizeNumber,
          },
          {
            query: query as string,
            address: address as string,
            industry: industry as string,
            experience: experience as string,
            salary: salary as string,
            company: company as string,
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
