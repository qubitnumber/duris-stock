export const convertDateToUnixTimestamp = (date: Date) => {
  return Math.floor(date.getTime() / 1000);
};

export const convertUnixTimestampToDate = (unixTimestamp: number) => {
  const milliseconds = unixTimestamp * 1000;
  return new Date(milliseconds).toLocaleDateString();
};

export const createDate = (date: string, days: number, weeks: number, months: number, years: number) => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days + 7 * weeks);
  newDate.setMonth(newDate.getMonth() + months);
  newDate.setFullYear(newDate.getFullYear() + years);
  return newDate;
};

export const createAgoHours = (hours: number, days: number, weeks: number, months: number, years: number) => {
  return hours + 24 * days + 24 * 7 * weeks + 24 * 31 * months + 24 * 365 * years;
};