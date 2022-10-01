import { hasOwn } from "../../tools";
const componentHandlesImpl = {
  $el: (i: any) => Reflect.get(i.vnode, "elm"),
  $data: (i: any) => Reflect.get(i, "setupState"),
  $slots: (i: any) => Reflect.get(i, "slots"),
};

export const publicInstanceProxyHandles = {
  get(target: { _: object }, key: string) {
    const instance = Reflect.get(target, "_");
    const { setupState, props } = instance;
    if (hasOwn(setupState, key)) {
      return Reflect.get(setupState, key);
    } else if (hasOwn(props, key)) {
      return Reflect.get(props, key);
    }
    const componentHandlesResult = Reflect.get(componentHandlesImpl, key);
    if (componentHandlesResult) {
      return componentHandlesResult(instance);
    }
  },
};
