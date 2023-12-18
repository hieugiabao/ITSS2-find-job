import { getCompaniesPaginated } from "@/company.service";
import dbConnect from "@/dbConnect";
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
          add: location,
          ind: industry,
        } = req.query;
        let pageNumber = parseInt((page as string) ?? "1");
        let sizeNumber = parseInt((size as string) ?? "3");

        const result = await getCompaniesPaginated(
          {
            page: pageNumber,
            size: sizeNumber,
          },
          {
            query: query as string,
            address: location as string,
            industry: industry as string,
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
