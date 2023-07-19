import { Document, Model, ObjectId, Query, Schema, model } from "mongoose";
import { dateBits } from "./../helpers/common";
import Coupon from "./Coupon";
import User from "./User";

interface IClaim {
  coupon: ObjectId;
  user: ObjectId;
}

interface ClaimQueryHelpers {
  claimed(
    coupon: Schema.Types.ObjectId
  ): Query<any, Document<IClaim>> & ClaimQueryHelpers;
  claimedBy(
    user: Schema.Types.ObjectId
  ): Query<any, Document<IClaim>> & ClaimQueryHelpers;
}

const claimSchema = new Schema<IClaim>(
  {
    coupon: {
      type: Schema.Types.ObjectId,
      ref: Coupon,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
  },
  {
    timestamps: true,
    query: {
      claimed(coupon: Schema.Types.ObjectId) {
        return this.where("coupon").equals(coupon);
      },
      claimedBy(user: Schema.Types.ObjectId) {
        const now = Date.now();
        const dbs = dateBits(now);
        return this.where("user").equals(user).where("createdAt", {
          $gte: dbs.beginning(),
          $lte: dbs.ending(),
        });
      },
    },
  }
);

claimSchema.pre("save", async function () {
  const claimFound = await ClaimModel.find().claimed(this.coupon);
  if (!!claimFound) {
    throw Error("[coupon] Coupon has been claimed already");
  }
  const claims = await ClaimModel.find().claimedBy(this.user).exec();
  const claimLimit = (
    await import("../constant/appConfig.js")
      .then((mod) => mod.default)
      .then((defaultMod) => defaultMod.appConfig())
  ).dailyMaxClaimsPerUser;
  if (claims >= claimLimit) {
    throw Error("[user:claims:exceeds] User has reached max daily claims");
  }
});

const ClaimModel = model<IClaim, Model<IClaim, ClaimQueryHelpers>>(
  "Claim",
  claimSchema
);
export default ClaimModel;
