import { isFunction } from "../../tools";
import { getCurrentInstance } from "./component";

export function provide(key: any, value: any) {
  const currentInstace = getCurrentInstance();

  if (currentInstace) {
    let { provides } = currentInstace;
    const parentProvides = currentInstace.parent.provides;
    // init
    if (parentProvides === provides) {
      provides = currentInstace.provides = Object.create(parentProvides);
    }

    Reflect.set(provides, key, value);
  }
}

export function inject(key: any, defaultVal: any) {
  const currentInstace = getCurrentInstance();

  if (currentInstace) {
    const { parent } = currentInstace;
    const parentProvides = parent.provides;
    if (key in parentProvides) {
      return Reflect.get(parentProvides, key);
    } else if (defaultVal) {
      if (isFunction(defaultVal)) {
        return defaultVal();
      }
      return defaultVal;
    }
  }
}
