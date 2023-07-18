import { Document, Model, ObjectId, Query, Schema, model } from "mongoose";
import Coupon from "./Coupon";
import User from "./User";

const MAX_CLAIMS_PER_DAY = 3;

interface IClaim {
  coupon: ObjectId;
  user: ObjectId;
}

interface ClaimQueryHelpers {
  claimed(coupon: Schema.Types.ObjectId): Query<any, Document<IClaim>> & ClaimQueryHelpers;
  claimedBy(user: Schema.Types.ObjectId): Query<any, Document<IClaim>> & ClaimQueryHelpers;
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
        const now = Date.now(),
          sod = new Date(now),
          eod = new Date(now);
        sod.setHours(0) &&
          sod.setMinutes(0) &&
          sod.setSeconds(0) &&
          sod.setMilliseconds(0);
        eod.setHours(23) &&
          eod.setMinutes(59) &&
          eod.setSeconds(59) &&
          eod.setMilliseconds(999);
        return this.where("user").equals(user).where("createdAt", {
          $gte: sod,
          $lte: eod,
        });
      },
    },
  }
);

claimSchema.pre("save", async function() {
  const claimFound = await ClaimModel.find().claimed(this.coupon);
  if (!!claimFound) {
    throw Error("[coupon] Coupon has been claimed already");
  }
  const claims = await ClaimModel.find().claimedBy(this.user).exec();
  if (claims >= MAX_CLAIMS_PER_DAY) {
    throw Error("[user:claims:exceeds] User has reached max daily claims");
  }
})

const ClaimModel = model<IClaim, Model<IClaim, ClaimQueryHelpers>>("Claim", claimSchema);
export default ClaimModel;
