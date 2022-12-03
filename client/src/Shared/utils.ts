export const wait = (milliseconds: number) => new Promise(resolve => setTimeout(resolve, milliseconds));
export const waitThen = (milliseconds: number, func: Function) => wait(milliseconds).then(() => func());
export const minToMs = (minutes: number) => minutes * 60000;
export const msToTimeString = (dateMilliseconds: number, timeZone: string) => {
  return Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
  })
  .format(new Date(dateMilliseconds))
  .replaceAll(/\s(AM|PM)/gi, '');
};
// export const msToDateTimeString = (dateMilliseconds: number, timeZone: string) => {
//   return Intl.DateTimeFormat("en-US", {
//     year: "numeric",
//     month: "2-digit",
//     day: "2-digit",
//     hour: "numeric",
//     minute: "numeric",
//     second: "numeric",
//     hour12: false,
//     timeZone: timeZone,
//     timeZoneName: 'short'
//   })
//   .format(dateMilliseconds)
//   .replaceAll(/(\s\w{3})|(,)/gi, '')
// };
