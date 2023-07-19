import Claim from "../../models/Claim";
import Coupon from "../../models/Coupon";
import User from "../../models/User";
import { sendMail } from "../../services/mailer";

export async function claim(email: string, code: string) {
  let user = await User.findOne({ email });
  if (!user) {
    return {
      error_code: "user:notfound",
      error_message: "Could not find user with given email",
    };
  }
  const recent = new Date();
  const claimable = await Coupon.findOne({
    code,
    effectiveFrom: { $lte: recent },
    effectiveUntil: { $gte: recent },
  });
  if (!claimable) {
    return {
      error_code: "coupon:invalid",
      error_message: "Coupon cannot be found or expired",
    };
  }
  const newClaim = new Claim({
    coupon: claimable._id,
    user: user._id,
  });
  try {
    await newClaim.save();
    user.points += claimable.points;
    await user.save({ validateBeforeSave: false });
    sendMail(
      { name: user.name, email: user.email },
      "Coupon Claimed Successfully",
      `You have increased you reward point by (+${claimable.points}). Your current point is: ${user.points}`
    );
  } catch (error: any) {
    return {
      error_code: "claim:failed",
      error_message: error.message,
    };
  }
  const claimed: { [key: string]: any } = { ...newClaim.toJSON() };
  delete claimed.user;
  delete claimed.coupon;
  claimed.code = claimable.code;
  claimed.user = user.email;
  return claimed;
}
