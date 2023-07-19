import mongoose, { Schema, model } from "mongoose";

const DURATION_IN_DAYS = 2;
const ValidatorError = mongoose.Error.ValidatorError;

interface ICoupon {
  code: string;
  effectiveFrom: Date;
  effectiveUntil: Date;
  points: number;
}

const couponSchema = new Schema<ICoupon>(
  {
    code: {
      type: String,
      required: true,
    },
    effectiveFrom: {
      type: Date,
      required: true,
      default: () => Date.now(),
    },
    effectiveUntil: {
      type: Date,
    },
    points: {
      type: Number,
      default: 100,
      get: (v: number) => Math.round(v),
      set: (v: number) => Math.round(v),
    },
  },
  { timestamps: true }
);

couponSchema.post("validate", function () {
  let expiration;
  if (!this.effectiveUntil) {
    expiration = new Date(this.effectiveFrom);
    expiration.setUTCDate(expiration.getUTCDate() + DURATION_IN_DAYS);
  } else {
    expiration = new Date(this.effectiveUntil);
  }
  if (expiration.getTime() < Date.now()) {
    const error = new ValidatorError({
      path: "effectiveUntil",
      message: "Code expires on creation",
      reason: `[effectiveUntil](${expiration}) provided-with/calcuated is lower than current`,
    });
    throw error;
  }
  if (expiration < this.effectiveFrom) {
    const error = new ValidatorError({
      message: "Invalid effect duration",
      path: "effectiveUntil",
      reason: `[effectiveUntil](${this.effectiveUntil.getTime()}) < [effectiveFrom](${this.effectiveFrom.getTime()})`,
    });
    throw error;
  }
  this.effectiveUntil = expiration;
});

couponSchema.path("code").validate(async function (v: string) {
  const found = await this.$model("Coupon").findOne({ code: v });
  return !found;
}, "Coupon code already exists");

export default model<ICoupon>("Coupon", couponSchema);
