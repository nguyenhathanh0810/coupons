import { Request, Response, Router } from "express";
import { dateBits } from "../../helpers/common";
import couponController from "../controllers/couponController";

interface RequestQuery {
  date: string;
  page: string;
  window: string;
}
const couponRouter = Router();

couponRouter
  .route("/")
  .get(async function (req: Request<{}, {}, {}, RequestQuery>, res: Response) {
    let { date, page, window } = req.query;
    const result = await couponController.list(new Date(date), page, window);
    res.status(200).json(result).end();
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
    if (activeTime === undefined) {
      activeTime = new Date();
    } else {
      activeTime = new Date(activeTime);
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
    const result = await couponController.status(coupon);
    res.status(200).json(result).end();
  });

export default couponRouter;
