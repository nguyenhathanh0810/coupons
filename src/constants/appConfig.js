export function appConfig() {
  let adminToken = `admin:${process.env.ADMIN_TOKEN}`;
  let dailyMaxClaimsPerUser = parseInt(`${process.env.MAX_CLAIMS_PER_DAY}`);
  if (isNaN(dailyMaxClaimsPerUser)) {
    dailyMaxClaimsPerUser = 3;
  }
  let maxCreationsInARow = parseInt(`${process.env.MAX_CREATIONS_IN_A_ROW}`);
  if (isNaN(maxCreationsInARow)) {
    maxCreationsInARow = 10_000;
  }
  return {
    adminToken,
    dailyMaxClaimsPerUser,
    maxCreationsInARow,
  };
}
