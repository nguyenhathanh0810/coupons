import { Express } from "express";
import couponRoutes from "./routes/coupons";
import userRouter from "./routes/users";
import claimRouter from "./routes/claims";

export default (app: Express) => {
  app.use("/api/users", userRouter);
  app.use("/api/coupons", couponRoutes);
  app.use("/api/claims", claimRouter);
};
