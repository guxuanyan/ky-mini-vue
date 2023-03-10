import { ShapeFlags, Fragment, Text } from "../../tools/ShapeFlags";
import { createAppApi } from "./createApp";
import { processComponent } from "./processComponent";
import { patchMountChildren, processElement } from "./processElement";
export function createRenderer(options: any) {
  const {
    createElement: _createElement,
    insert: _insert,
    patchProps: _patchProps,
    remove,
  } = options;
  const fns = {
    _patch: patch,
    _createElement,
    _patchProps,
    _insert,
  };
  function render(vnode: any, container: any) {
    // 处理虚拟Dom
    patch(vnode, container, null);
  }

  function patch(vnode: any, container: any, parenComponent: any) {
    handleProcessEffect(vnode, container, parenComponent);
  }

  function handleProcessEffect(
    vnode: any,
    container: any,
    parenComponent: any
  ) {
    const { type, shapeFlags } = vnode;
    switch (type) {
      case Fragment:
        processFragment(vnode, container, parenComponent);
        break;
      case Text:
        processText(vnode, container);
        break;

      default:
        if (shapeFlags & ShapeFlags.ELEMENT) {
          // 处理Dom
          processElement(vnode, container, parenComponent, fns);
        } else if (shapeFlags & ShapeFlags.STATEFUL_COMPONENT) {
          // 处理组件
          processComponent(vnode, container, parenComponent, fns);
        }
        break;
    }
  }

  function processFragment(vnode: any, container: any, parenComponent: any) {
    patchMountChildren(vnode.children, container, parenComponent, patch);
  }

  function processText(vnode: any, container: any) {
    const { children } = vnode;
    const textNode = (vnode.elm = document.createTextNode(children));
    container.append(textNode);
  }
  return { createApp: createAppApi(render) };
}
