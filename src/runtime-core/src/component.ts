export function createComponentInstance(vnode: any) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    proxy: null,
  };
  return component;
}

export function setupComponent(instance: any) {
  // TODO:
  // initProps
  // initSlots
  // vue3 里除了有状态的组件还有函数组件（没有状态）
  setupStatefulComponent(instance);
}

function setupStatefulComponent(instance: any) {
  const Component = instance.type;
  const { setup } = Component;
  if (setup) {
    // function == > render fn or Object
    const setupResult = setup();
    handleSetupResult(instance, setupResult);
  }
}

function handleSetupResult(instance: any, setupResult: any) {
  // TODO:
  // function
  if (typeof setupResult == "object") {
    instance.setupState = setupResult;
  }
  // 查看是不是有 render
  finishComponentSetup(instance);
}
function finishComponentSetup(instance: any) {
  const Component = instance.type;
  if (Component.render) {
    instance.render = Component.render;
  }
}
