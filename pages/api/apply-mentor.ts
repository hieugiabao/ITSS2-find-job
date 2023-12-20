import dbConnect from "@/dbConnect";
import { NextApiRequest, NextApiResponse } from "next";
import * as formidable from "formidable";
import * as mongoose from "mongoose";
import { uploadFile } from "@/firebase/storage";
import { applyMentor } from "@/apply.service";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  const { method } = req;

  // FIX ME: get user id from session
  const userId = "65787da4577f298355d4adce";

  switch (method) {
    case "POST":
      try {
        const form = new formidable.IncomingForm({
          maxFileSize: 8 * 1024 * 1024, // 8mb
        });
        form.parse(req, async (err, fields, files) => {
          if (err) {
            console.log(err);
            throw err;
          }
          const cv = files.cv?.[0];

          if (!cv) {
            res.status(400).json({ success: false, message: "No file" });
            return;
          }

          const path = await uploadFile(
            `cv/${userId}-${Date.now()}-${cv.originalFilename}`,
            cv
          );

          const { email, mentorId, description } = fields;

          if (email && email.length > 0 && mentorId && mentorId.length > 0) {
            const result = await applyMentor({
              cvUrl: path,
              email: email[0],
              description: description?.[0],
              mentor: new mongoose.Types.ObjectId(mentorId[0]),
              user: new mongoose.Types.ObjectId(userId),
            });

            res.status(200).json({ success: true, data: result });
          } else {
            res.status(400).json({ success: false, message: "No data" });
          }
        });
      } catch (error) {
        console.log(error);
        res.status(500).json({ success: false });
      }
      break;
    case "GET":
    case "PUT":
    case "DELETE":
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
