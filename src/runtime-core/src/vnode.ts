import { isArray, isObject, isString } from "../../tools";
import { ShapeFlags, Text } from "../../tools/ShapeFlags";

export function createVNode(type: any, props?: any, children?: any) {
  const vnode = {
    type,
    props,
    children,
    elm: null,
    shapeFlags: getTypeShapeFlags(type),
  };
  childrenShapeFlags(children, vnode);
  return vnode;
}

function getTypeShapeFlags(type: any) {
  return typeof type == "string"
    ? ShapeFlags.ELEMENT
    : ShapeFlags.STATEFUL_COMPONENT;
}

function childrenShapeFlags(children: any, vnode: any) {
  // children 的值
  if (isString(children)) {
    vnode.shapeFlags |= ShapeFlags.TEXT_CHLIDREN;
  } else if (isArray(children)) {
    vnode.shapeFlags |= ShapeFlags.ARRAY_CHLIDREN;
  }
  // children 是否 是插槽
  if (vnode.shapeFlags & ShapeFlags.STATEFUL_COMPONENT && isObject(children)) {
    vnode.shapeFlags |= ShapeFlags.SLOTS_CHILDREN;
  }
}

export function createTextVNode(text: String) {
  return createVNode(Text, {}, text);
}
