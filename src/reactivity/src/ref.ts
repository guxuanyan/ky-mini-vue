import { hasChanged, isObject } from "../../tools";
import { isTracking, trackEffects, triggerEffects } from "./effect";
import { reactive } from "./reactive";

class RefImpl {
  private _value: any;
  public deps: any;
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
      triggerEffects(this.deps);
    }
  }
}

function trackRefValue(ref: RefImpl) {
  if (isTracking()) {
    trackEffects(ref.deps);
  }
}
function convert(val: any) {
  // 如何是对象返回 reactive的实例
  return isObject(val) ? reactive(val) : val;
}

export function ref(raw: any): any {
  return new RefImpl(raw);
}
