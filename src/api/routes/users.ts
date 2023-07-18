import { Request, Response, Router } from "express";
import { create, findByEmail, list } from "../controllers/userController";

const userRouter = Router();
userRouter
  .route("/")
  .post(async function (req: Request, res: Response) {
    const { fullname, email } = req.body;
    const result = await create({ fullname, email });
    if (result.hasOwnProperty("error_code")) {
      res.status(200);
    } else {
      res.status(201);
    }
    res.json(result).end();
  })
  .get(async function (_, res: Response) {
    res
      .status(200)
      .json(await list())
      .end();
  });
userRouter
  .route("/:email")
  .get(async function (req: Request, res: Response) {
    const { email } = req.params;
    const result = await findByEmail(email);
    res.status(200).json(result).end();
  });

export default userRouter;
