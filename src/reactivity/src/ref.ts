import { hasChanged, isObject } from "../../tools";
import { isTracking, trackEffects, triggerEffects } from "./effect";
import { reactive } from "./reactive";

class RefImpl {
  private _value: any;
  public deps: any;
  public _ky_isRef = true;
  constructor(raw: any) {
    //初始化
    this._value = convert(raw);
    this.deps = new Set();
  }
  get value() {
    trackRefValue(this);
    return this._value;
  }

  set value(newValue: any) {
    if (hasChanged(this._value, newValue)) {
      //更新
      this._value = convert(newValue);
      triggerRefValue(this);
    }
  }
}

export function trackRefValue(ref: any) {
  if (isTracking()) {
    trackEffects(ref.deps);
  }
}
export function triggerRefValue(ref: any) {
  triggerEffects(ref.deps);
}
function convert(val: any) {
  // 如何是对象返回 reactive的实例
  return isObject(val) ? reactive(val) : val;
}

export function ref(raw: any): any {
  return new RefImpl(raw);
}

export function isRef(ref: any) {
  return !!ref._ky_isRef;
}

export function unRef(ref: any) {
  return isRef(ref) ? ref.value : ref;
}
const proxyRefsHandlers = {
  get(target: any, key: any) {
    return unRef(Reflect.get(target, key));
  },
  set(target: any, key: any, newVal: any) {
    const value = Reflect.get(target, key);
    if (isRef(value) && !isRef(newVal)) {
      return Reflect.set(target[key], "value", newVal);
    } else {
      return Reflect.set(target, key, newVal);
    }
  },
};

export function proxyRefs(ref: any) {
  return new Proxy(ref, proxyRefsHandlers);
}
