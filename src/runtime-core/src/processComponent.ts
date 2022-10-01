/**
 * 处理组件
 */

import { createComponentInstance, setupComponent } from "./component";
import { publicInstanceProxyHandles } from "./publicInstanceProxyHandles";
import { patch } from "./render";

export function processComponent(vnode: any, container: any) {
  // 挂载组件
  mountComponent(vnode, container);
}

function mountComponent(vnode: any, container: any) {
  // 创建组件实例
  const instance = createComponentInstance(vnode);
    // 设置组件代理
  Reflect.set(
    instance,
    "proxy",
    new Proxy({ _: instance }, publicInstanceProxyHandles)
  );
  // 调用组件setup
  setupComponent(instance);
  // 调用render
  setupRenderEffect(instance, container, vnode);
}

function setupRenderEffect(instance: any, container: any, vnode: any) {
  // call 后续参数传入参数列表
  // subTree == root element
  const { proxy } = instance;
  const subTree = instance.render.call(proxy);
  patch(subTree, container);
  vnode.elm = subTree.elm;
}
