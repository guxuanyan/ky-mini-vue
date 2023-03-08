import { shallowReadonly } from "../../reactivity/src/reactive";
import { isObject } from "../../tools";
import { emit } from "./componentEmit";
import { initProps } from "./initProps";
import { initSlots } from "./initSlots";

export function createComponentInstance(vnode: any, parent: any) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    proxy: null,
    props: null,
    slots: null,
    provides: parent ? parent.provides : {},
    parent: parent || {},
    $emit: () => {},
  };

  component.$emit = emit.bind(null, component) as any;

  return component;
}

export function setupComponent(instance: any) {
  // TODO:
  // initProps
  initProps(instance);
  // initSlots
  initSlots(instance);
  // vue3 里除了有状态的组件还有函数组件（没有状态）
  setupStatefulComponent(instance);
}

function setupStatefulComponent(instance: any) {
  const Component = instance.type;
  const { setup } = Component;
  if (setup) {
    // function == > render fn or Object
    const shallowProps = shallowReadonly(instance.props);
    setCurrentInstance(instance);
    const setupResult = setup(shallowProps, {
      emit: instance.$emit,
    });
    setCurrentInstance(null);
    handleSetupResult(instance, setupResult);
  }
}

function handleSetupResult(instance: any, setupResult: any) {
  // TODO:
  // function
  if (isObject(setupResult)) {
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
let currentInstance: any = null;

export function getCurrentInstance() {
  return currentInstance;
}

function setCurrentInstance(instance: any) {
  currentInstance = instance;
}
