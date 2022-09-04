import { extend, isObject } from "../../tools";
import { track, trigger } from "./effect";
import { reactive, readonly } from "./reactive";

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);

export const enum ReactiveFlags {
  ISREADONLY = "__is-readonly",
  ISREACTIVE = "__is_reactive",
}

export function createGetter(
  isReadonly: Boolean = false,
  isShallow: Boolean = false
) {
  return function (target: any, key: any) {
    if (key == ReactiveFlags.ISREADONLY) {
      return isReadonly;
    }

    if (key == ReactiveFlags.ISREACTIVE) {
      return !isReadonly;
    }

    const res = Reflect.get(target, key);

    if (isShallow) {
      return res;
    }

    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res);
    }

    if (!isReadonly) {
      track(target, key);
    }

    return res;
  };
}

export function createSetter(shallow = false) {
  return function (target: any, key: any, value: any) {
    if (shallow == true) {
      return;
    }
    const result = Reflect.set(target, key, value);
    trigger(target, key);
    return result;
  };
}

export const mutableHandlers = {
  get,
  set,
};

export const readonlyHandlers = {
  get: readonlyGet,
  set(target: any, key: any) {
    console.warn(`Cannot be modified because it is read-only：${JSON.stringify(target)}`);
    return Reflect.get(target, key);
  },
};

export const shallowReadonlyHandles = extend({}, readonlyHandlers, {
  get: shallowReadonlyGet,
});
