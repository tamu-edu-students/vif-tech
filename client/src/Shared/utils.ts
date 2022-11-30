export const wait = (milliseconds: number) => new Promise(resolve => setTimeout(resolve, milliseconds));
export const waitThen = (milliseconds: number, func: Function) => wait(milliseconds).then(() => func());
export const msToTimeString = (dateMilliseconds: number) => {
  return Intl.DateTimeFormat("en-CA", {
    hour: "numeric",
    minute: "numeric",
    timeZone: 'CST',
    timeZoneName: 'short'
  })
  .format(new Date(dateMilliseconds))
  .replaceAll(/(\s\w{3})|(,)|(\s\w\.m\.)/gi, '');
};
export const msToDateTimeString = (dateMilliseconds: number) => {
  return Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
    timeZone: 'CST',
    timeZoneName: 'short'
  })
  .format(dateMilliseconds)
  .replaceAll(/(\s\w{3})|(,)/gi, '')
};
