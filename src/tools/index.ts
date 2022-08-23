export const extend = Object.assign;

export const isObject = (val: any) => {
  return val !== null && typeof val == "object";
};

export function hasChanged(val: any, newValue: any) {
  return !Object.is(val, newValue);
}
