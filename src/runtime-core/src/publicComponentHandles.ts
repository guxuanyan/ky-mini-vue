const componentHandlesImpl = {
  $el: (instance: any) => Reflect.get(instance.vnode, "elm"),
  $data: (instance: any) => Reflect.get(instance, "setupState"),
};

export const publicInstanceProxyHandles = {
  get(target: any, key: any) {
    const instance = Reflect.get(target, "_");
    if (key in instance.setupState) {
      return Reflect.get(instance.setupState, key);
    }
    const componentHandlesResult = Reflect.get(componentHandlesImpl, key);
    if (componentHandlesResult) {
      return componentHandlesResult(instance);
    }
  },
};
