/**
 * 处理组件
 */

import { createComponentInstance, setupComponent } from "./component";
import { patch } from "./render";

export function processComponent(vnode: any, container: any) {
  // 挂载组件
  mountComponent(vnode, container);
}

function mountComponent(vnode: any, container: any) {
  // 创建组件实例
  const instance = createComponentInstance(vnode);
  // 调用组件setup
  setupComponent(instance);
  // 调用render
  setupRenderEffect(instance, container);
}

function setupRenderEffect(instance: any, container: any) {
  // call 后续参数传入参数列表
  const subTree = instance.render.call(instance.setupState);
  patch(subTree, container);
}
