import { isObject } from "../../tools";
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
  if (typeof vnode.type == "string") {
    // 处理Dom
    processElement(vnode, container);
  } else if (isObject(vnode.type)) {
    // 处理组件
    processComponent(vnode, container);
  }
}
