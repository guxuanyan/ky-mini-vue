import { isArray, isString } from "../../tools";
import { ShapeFlags } from "../../tools/ShapeFlags";

export function createVNode(type: any, props?: any, children?: any) {
  const vnode = {
    type,
    props,
    children,
    elm: null,
    shapeFlags: getTypeShapeFlags(type),
  };
  getChildrenShapeFlags(children, vnode);
  return vnode;
}


function getTypeShapeFlags(type: any) {
  return typeof type == "string"
    ? ShapeFlags.ELEMENT
    : ShapeFlags.STATEFUL_COMPONENT;
}


function getChildrenShapeFlags(children: any, vnode: any) {
  // children 的值
  if (isString(children)) {
    vnode.shapeFlags |= ShapeFlags.TEXT_CHLIDREN;
  } else if (isArray(children)) {
    vnode.shapeFlags |= ShapeFlags.ARRAY_CHLIDREN;
  }
}
