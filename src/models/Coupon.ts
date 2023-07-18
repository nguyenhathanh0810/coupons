import { Schema, model } from "mongoose";

const DURATION_IN_DAYS = 1;

interface ICoupon {
  code: string,
  validFrom: Date,
  validUntil: Date,
  points: number
}

const couponSchema = new Schema<ICoupon>({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  validFrom: {
    type: Date,
    required: true,
    default: () => Date.now()
  },
  validUntil: {
    type: Date
  },
  points: {
    type: Number,
    default: 100,
    get: (v: number) => Math.round(v),
    set: (v: number) => Math.round(v)
  }
}, { timestamps: true });

couponSchema.post("validate", function() {
  if (this.validUntil && (this.validUntil < this.validFrom)) {
    throw new Error("[validUntil] is given but lower than [validFrom]");
  }
});
couponSchema.pre("save", function(next) {
  if (this.validUntil ?? true) {
    const expiration = new Date(this.validFrom);
    expiration.setUTCDate(this.validFrom.getUTCDate() + DURATION_IN_DAYS);
    this.validUntil = expiration;
  }
  if (this.validUntil.getTime() < Date.now()) {
    throw new Error("[validUntil] is expiring soon");
  }

  next();
})

export default model<ICoupon>("Coupon", couponSchema);