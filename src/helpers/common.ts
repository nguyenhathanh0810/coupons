export function randomString(length?: number) {
  let len = length ?? 1;
  if (len < 1) {
    len = 1;
  }
  return Math.random()
    .toString(36)
    .slice(2, 2 + len);
}

export function toLocaleDateTime(d: Date, tz: string): string {
  let _d = new Date(d),
    localeD: string;
  try {
    localeD = _d.toLocaleString("en-GB", localeOptions(tz));
  } catch (err) {
    console.log(err);
    localeD = _d.toLocaleString("en-GB", localeOptions());
  }
  return localeD;
}

export const dateBits = function (date: Date | number | string) {
  const A_DAY_MS = 24 * 60 * 60 * 1000;
  const beginning = () => {
    let result = new Date(date);
    if (!(result instanceof Date && !isNaN(result.getTime()))) {
      result = new Date();
    }
    return new Date(result.getTime() - (result.getTime() % A_DAY_MS));
  };
  const ending = () => {
    return new Date(beginning().getTime() + A_DAY_MS - 1);
  };
  return { beginning, ending };
};

const localeOptions = (tz?: string): Intl.DateTimeFormatOptions => ({
  dateStyle: "long",
  timeStyle: "long",
  timeZone: tz ?? "UTC",
});
