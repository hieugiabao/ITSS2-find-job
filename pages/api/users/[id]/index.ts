import dbConnect from "@/dbConnect";
import { getUserById, updateUser } from "@/user.service";
import { NextApiRequest, NextApiResponse } from "next";
import * as formidable from "formidable";
import { uploadFile } from "@/firebase/storage";

export const config = {
  api: {
    bodyParser: false,
  },
};

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
        console.log({ id });
        const form = new formidable.IncomingForm({
          maxFileSize: 8 * 1024 * 1024, // 8mb
        });
        form.parse(req, async (err, fields, files) => {
          try {
            if (err) {
              console.log(err);
              throw err;
            }
            let avatarUrl = "";
            const avatar = files.avatar?.[0];

            if (avatar) {
              avatarUrl = await uploadFile(
                `avatar/${id}-${avatar.originalFilename}`,
                avatar
              );
            }
            const { username, address, description } = fields;
            let [firstName, lastName] = username?.[0]?.split(" ", 2) || [];
            if (firstName && !lastName) {
              lastName = "";
            }
            const result = await updateUser(id as string, {
              firstName,
              lastName,
              address: address?.[0] ? Number(address?.[0]) : undefined,
              description: description?.[0],
              avatarUrl: avatarUrl || undefined,
            });
            res.status(200).json({
              success: true,
              data: result,
            });
          } catch (e) {
            console.log(e);
            res.status(500).json({ success: false });
          }
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
