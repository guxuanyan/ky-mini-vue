import { render } from "./render";
import { createVNode } from "./vnode";

/**
 *
 * @param rootComponent 组件
 * @returns Object mount
 */
export function createApp(rootComponent: any) {
  return {
    /**
     *
     * @param rootContainer 根元素或元素名
     */
    mount(rootContainer: any) {
      // component --> 转换为虚拟节点
      const vnode = createVNode(rootComponent);
      const elem = handleRootContainer(rootContainer);
      render(vnode, elem);
    },
  };
}

function handleRootContainer(rootContainer: any) {
  if (typeof rootContainer == "string") {
    return document.querySelector(rootContainer);
  }
  return rootContainer;
}
