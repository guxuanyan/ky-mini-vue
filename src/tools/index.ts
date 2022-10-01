export const extend = Object.assign;

export const isObject = (val: any) => {
  return val !== null && typeof val == "object";
};

export function hasChanged(val: any, newValue: any) {
  return !Object.is(val, newValue);
}

export function isString(val: any) {
  return typeof val == "string";
}

export function isArray(val: any) {
  return Array.isArray(val);
}

export const isOn = (str: string) => /on[A-Z]/.test(str);

export function getEventName(str: string) {
  return str.slice(2).toLowerCase();
}

export const isFunction = (fn: any) => typeof fn == "function";

export const hasOwn = (target: object, key: any) => target.hasOwnProperty(key);

export function cnamelize(str: string) {
  return str.replace(/-(\w)/, (_: any, c: string) => {
    return c.toUpperCase();
  });
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function toHandleKey(str: string) {
  return str ? "on" + capitalize(str) : "";
}
