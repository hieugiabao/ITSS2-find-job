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
    case "PUT":
     
        try{
             const {id} = req.query;
            const {  name: username, addr: address, des: description   } = JSON.parse(req.body);
            console.log("body",username,address,description)
            const result = await updateUser(
                {
                    username: username as string,
                    address: Number(address),
                    description: description as string
                },
                String(id)
                );
            res.status(200).json({
              success: true,
              data: result,
            });

        } catch (error) {
        console.log(error);
        res.status(500).json({ success: false });
      }
      break;
    case "DELETE":
    default:
      res.setHeader("Allow", ["GET","PUT"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
