import { randomString, toLocaleDateTime } from "../../helpers/common";
import Coupon from "../../models/Coupon";

const MODIFIER_MS = 2 * 60 * 1000; // 2 minutes

export default {
  generate: async (
    token: string,
    {
      size,
      activeTime,
      timezone,
    }: { size: number; activeTime: number | Date; timezone: string }
  ) => {
    console.log("👀", { token, size, activeTime, timezone });
    const appConfig = (
      await import("../../constants/appConfig.js").then((mod) => mod.default)
    ).appConfig();
    if (appConfig.adminToken !== `admin:${token}`) {
      return {
        error_code: "permission:denied",
        error_message: "Only administrator can generate counpons",
      };
    }
    if (isNaN(size) || size > appConfig.maxCreationsInARow || size < 1) {
      return {
        error_code: "genration:size:invalid",
        error_message: `The bunch generation size is acceptably between 1 and ${appConfig.maxCreationsInARow}`,
      };
    }
    const { effectiveFrom, coupons } = await bulkCreateCoupons(size);
    return {
      coupons: coupons.length,
      effectiveFrom: toLocaleDateTime(new Date(effectiveFrom), timezone),
    };
  },
};

async function bulkCreateCoupons(size: number) {
  const effectiveFrom = Date.now() + MODIFIER_MS;
  let remaining = size;
  const coupons = new Array();
  while (remaining > 0) {
    const codes = new Set<string>();
    do {
      codes.add(randomString(8));
    } while (codes.size < remaining);
    const created = await Coupon.insertMany(
      Array.from(codes).map((c) => ({
        code: c,
        effectiveFrom,
        points: 100,
      })),
      {
        ordered: false,
        limit: 1000,
      }
    );
    coupons.push(...created);
    remaining -= created.length;
  }
  return { effectiveFrom, coupons };
}
