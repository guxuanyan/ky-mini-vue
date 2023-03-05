import { ShapeFlags, Fragment, Text } from "../../tools/ShapeFlags";
import { processComponent } from "./processComponent";
import { patchMountChildren, processElement } from "./processElement";

export function render(vnode: any, container: any) {
  // 处理虚拟Dom
  patch(vnode, container);
}
export function patch(vnode: any, container: any) {
  handleProcessEffect(vnode, container);
}

function handleProcessEffect(vnode: any, container: any) {
  const { type, shapeFlags } = vnode;

  // Fragment
  switch (type) {
    case Fragment:
      processFragment(vnode, container);
      break;
    case Text:
      processText(vnode, container);
      break;

    default:
      if (shapeFlags & ShapeFlags.ELEMENT) {
        // 处理Dom
        processElement(vnode, container);
      } else if (shapeFlags & ShapeFlags.STATEFUL_COMPONENT) {
        // 处理组件
        processComponent(vnode, container);
      }
      break;
  }
}

function processFragment(vnode: any, container: any) {
  patchMountChildren(vnode.children, container);
}
function processText(vnode: any, container: any) {
  const { children } = vnode;
  const textNode = (vnode.elm = document.createTextNode(children));
  container.append(textNode);
}
