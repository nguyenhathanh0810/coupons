import { Request, Response, Router } from "express";
import { dateBits } from "../../helpers/common";
import couponController from "../controllers/couponController";

const couponRouter = Router();

couponRouter.route("/").get(async function (req: Request, res: Response) {
  const { date, page, window } = req.query;
  console.log(date, page, window);
  // Todo: handle fetching codes regarding queries

  res.status(200).json({ date, page, window }).end();
});
couponRouter
  .route("/generate")
  .post(async function (req: Request, res: Response) {
    let { adminToken, size, activeTime, timezone } = req.body;
    if (size === undefined) {
      // generate at maximum when size is omitted
      size = (
        await import("../../constants/appConfig.js")
          .then((mod) => mod.default)
          .then((defaultMod) => defaultMod.appConfig())
      ).maxCreationsInARow;
    } else {
      size = parseInt(size);
    }
    const result: { [key: string]: any } = await couponController.generate(
      adminToken,
      { size, activeTime, timezone }
    );
    if (result.hasOwnProperty("error_code")) {
      res.status(200);
    } else {
      res.status(201);
      const startOfToday = dateBits(Date.now()).beginning();
      result.links = [
        `http://localhost:3001/api/coupons/?date=${startOfToday.getTime()}&page=1&window=200`,
      ];
    }
    res.json(result).end();
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
