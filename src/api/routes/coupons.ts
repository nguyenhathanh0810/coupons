import { Request, Response, Router } from "express";

const couponRouter = Router();

couponRouter
  .route("/")
  .get(async function (req: Request, res: Response) {
    const { date, page, window } = req.query;
    console.log(date, page, window);
    // Todo: handle fetching codes regarding queries

    res.status(200).json({ date, page, window }).end();
  });
couponRouter
  .route("/generate")
  .post(async function (req: Request, res: Response) {
    const { adminToken } = req.body;
    console.log(adminToken);
    // Todo: handle admin generating 10k codes for current day

    res.status(201).send(adminToken).end();
  });
couponRouter
  .route("/:coupon/status")
  .get(async function (req: Request, res: Response) {
    const { coupon } = req.params;
    console.log(coupon);
    // Todo: handle revealing coupon statuss

    res.status(200).send(coupon).end();
  });

export default couponRouter;
