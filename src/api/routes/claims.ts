import { Request, Response, Router } from "express";
import { claim } from "../controllers/claimController";

const claimRouter = Router();
claimRouter
  .route("/")
  .post(async function (req: Request, res: Response) {
    const { email, code } = req.body;
    const result = await claim(email, code);
    res.status(200).json(result).end();
  });
claimRouter
  .route("/by-user/:email")
  .get(async function (req: Request, res: Response) {
    const { email } = req.params;
    const { date } = req.query;
    console.log(email, date);
    // Todo: handle fetching coupons claimed by user (email)

    res.status(200).json({ email, date }).end();
  });

export default claimRouter;
