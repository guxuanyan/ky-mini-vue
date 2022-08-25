import { ReactiveEffect } from "./effect";
import { trackRefValue, triggerRefValue } from "./ref";

class ComputeRefImpl {
  private _effect: ReactiveEffect;
  private _dirty: boolean;
  private _value: any;
  deps: Set<any>;
  constructor(fn: Function) {
    this.deps = new Set();
    this._dirty = true;
    this._effect = new ReactiveEffect(fn, () => {
      if (this._dirty) return;
      this._dirty = true;
      triggerRefValue(this);
    });
  }

  get value() {
    trackRefValue(this);
    if (this._dirty) {
      this._dirty = false;
      this._value = this._effect._run();
    }
    return this._value;
  }
}

export function computed(getter: Function) {
  return new ComputeRefImpl(getter);
}
