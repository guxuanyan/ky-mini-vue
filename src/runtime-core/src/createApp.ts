import { createVNode } from "./vnode";

export function createAppApi(render: any) {
  /**
   *
   * @param rootComponent 组件
   * @returns Object mount
   */
  return function createApp(rootComponent: any) {
    return {
      /**
       *
       * @param rootContainer 根元素或元素名
       */
      mount(rootContainer: any) {
        // component --> 转换为虚拟节点
        const vnode = createVNode(rootComponent);
        const containerElm = handleRootContainer(rootContainer);
        render(vnode, containerElm);
      },
    };
  };
}

function handleRootContainer(rootContainer: any) {
  if (typeof rootContainer == "string") {
    return document.querySelector(rootContainer);
  }
  return rootContainer;
}
