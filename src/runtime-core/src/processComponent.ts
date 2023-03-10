/**
 * 处理组件
 */

import { createComponentInstance, setupComponent } from "./component";
import { publicInstanceProxyHandles } from "./publicInstanceProxyHandles";

export function processComponent(
  vnode: any,
  container: any,
  parenComponent: any,
  fns: any
) {
  const { _patch } = fns;
  // 挂载组件`
  mountComponent(vnode, container, parenComponent, _patch);
}

function mountComponent(
  vnode: any,
  container: any,
  parenComponent: any,
  patch: Function
) {
  // 创建组件实例
  const instance = createComponentInstance(vnode, parenComponent);
  // 设置组件代理
  Reflect.set(
    instance,
    "proxy",
    new Proxy({ _: instance }, publicInstanceProxyHandles)
  );
  // 调用组件setup
  setupComponent(instance);
  // 调用render
  setupRenderEffect(instance, container, vnode, patch);
}

function setupRenderEffect(
  instance: any,
  container: any,
  vnode: any,
  patch: Function
) {
  // call 后续参数传入参数列表
  // subTree == root element
  const { proxy } = instance;
  const subTree = instance.render.call(proxy);
  patch(subTree, container, instance);
  vnode.elm = subTree.elm;
}
