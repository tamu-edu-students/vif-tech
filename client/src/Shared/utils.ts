export const wait = (milliseconds: number) => new Promise(resolve => setTimeout(resolve, milliseconds));
export const waitThen = (milliseconds: number, func: Function) => wait(milliseconds).then(() => func());