import crypto from "crypto";

export function randomString(length?: number) {
  let arr = new Uint8Array((length || 40) / 2);
  crypto.getRandomValues(arr);
  return Array.from(arr, (dec) => dec.toString(16).padStart(2, "0")).join('');
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

const localeOptions = (tz?: string): Intl.DateTimeFormatOptions => ({
  dateStyle: "long",
  timeStyle: "long",
  timeZone: tz ?? "UTC"
})
