import dbConnect from "@/dbConnect";
import { getUserById, updateUser } from "@/user.service";
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
        const result = await getUserById(req.query.id as string);
        res.status(200).json({
          success: true,
          data: result,
        });
      } catch (error) {
        console.log(error);
        res.status(500).json({ success: false });
      }
      break;
    case "POST":
      try {
        const { id } = req.query;

        const { username, address, description, avatarUrl } = req.body;
        let [firstName, lastName] = username?.split(" ", 2) || [];
        if (firstName && !lastName) {
          lastName = "";
        }
        const result = await updateUser(id as string, {
          firstName,
          lastName,
          address: address ? Number(address) : undefined,
          description: description,
          avatarUrl: avatarUrl,
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
    case "PUT":
    case "DELETE":
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
