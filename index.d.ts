declare export const $cleaner: (string) => void;
declare export const $receiver:(sting, ...args: Array<any>) => Promise<any> | void | undefined;
// 确保第一个参数为字符串
declare export const $sender:(string,...args: Array<any> ) => Promise<any> | void | undefined;
