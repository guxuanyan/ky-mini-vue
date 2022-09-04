import { isObject } from "../../tools";
import { ShapeFlags } from "../../tools/ShapeFlags";
import { processComponent } from "./processComponent";
import { processElement } from "./processElement";

export function render(vnode: any, container: any) {
  // 处理虚拟Dom
  patch(vnode, container);
}
export function patch(vnode: any, container: any) {
  handleProcessEffect(vnode, container);
}

function handleProcessEffect(vnode: any, container: any) {
  const { shapeFlags } = vnode;
  if (shapeFlags & ShapeFlags.ELEMENT) {
    // 处理Dom
    processElement(vnode, container);
  } else if (shapeFlags & ShapeFlags.STATEFUL_COMPONENT) {
    // 处理组件
    processComponent(vnode, container);
  }
}
