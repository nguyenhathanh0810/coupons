import { randomString, toLocaleDateTime } from "../../helpers/common";
import Claim from "../../models/Claim";
import Coupon from "../../models/Coupon";
import { dateBits } from "./../../helpers/common";

const MODIFIER_MS = 2 * 60 * 1000; // 2 minutes

export default {
  generate: async (
    token: string,
    {
      size,
      activeTime,
      timezone,
    }: { size: number; activeTime: Date; timezone: string }
  ) => {
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
    if (isNaN(activeTime.getTime())) {
      return {
        error_code: "activeTime:invalid",
        error_message:
          "The given (activeTime) cannot be casted to a valid datetime",
      };
    }
    const { effectiveFrom, coupons } = await bulkCreateCoupons(
      size,
      activeTime
    );
    return {
      coupons: coupons.length,
      effectiveFrom: toLocaleDateTime(new Date(effectiveFrom), timezone),
    };
  },
  list: async (date: Date, page: any, window: any) => {
    let _date, _page, _window;
    _date = new Date(date);
    if (isNaN(_date.getTime())) {
      _date = new Date();
    }
    const dbs = dateBits(_date);
    _page = parseInt(page) || 1;
    _window = parseInt(window) || 200;
    const coupons = await Coupon.aggregate([
      {
        $match: {
          effectiveFrom: {
            $gte: dbs.beginning(),
            $lte: dbs.ending(),
          },
        },
      },
    ])
      .skip((_page - 1) * window)
      .limit(_window)
      .sort("-createdAt");
    return {
      date: _date.getTime(),
      page: _page,
      window: _window,
      list: coupons,
    };
  },
  status: async (code: string) => {
    const coupon = await Coupon.findOne({ code });
    if (!coupon) {
      return {
        error_code: "coupon:invalid",
        error_message: "Coupon does not exist",
      };
    }
    let status = "Available";
    const current = new Date();
    if (coupon.effectiveFrom > current) {
      status = "Inactivated";
    }
    if (coupon.effectiveUntil <= current) {
      status = "Expired";
    }
    if (await Claim.findOne().claimed(coupon._id)) {
      status = "Claimed";
    }
    return {
      coupon: code,
      status: status,
    };
  },
};

async function bulkCreateCoupons(size: number, activeTime: Date) {
  const effectiveFrom = activeTime.getTime() + MODIFIER_MS;
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
