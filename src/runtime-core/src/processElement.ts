/**
 * 处理DOM vnode to dom
 */

import { extend, getEventName, isFunction, isObject, isOn } from "../../tools";
import { ShapeFlags } from "../../tools/ShapeFlags";

export function processElement(
  vnode: any,
  container: any,
  parenComponent: any,
  fns: any
) {
  // init or update
  mountElement(vnode, container, parenComponent, fns);
  // TODO: update
}

function mountElement(
  initialVNode: any,
  container: any,
  parenComponent: any,
  fns: any
) {
  const { _patch, _createElement, _patchProps, _insert } = fns;
  const { type: tag, props, children, shapeFlags } = initialVNode;
  // const elm = document.createElement(tag);
  const elm = _createElement(tag);

  // handleProps(elm, props);
  _patchProps(elm, props);

  mountChildren(elm, children, shapeFlags, parenComponent, _patch);
  initialVNode.elm = elm;

  // container.append(elm);
  _insert(elm, container)
}

function handleProps(elm: any, props: any) {
}

function mountChildren(
  elm: any,
  children: any,
  shapeFlags: any,
  parentComponent: any,
  patch: Function
) {
  //  children --->> string or Array
  if (shapeFlags & ShapeFlags.TEXT_CHLIDREN) {
    elm.textContent = children;
  } else if (shapeFlags & ShapeFlags.ARRAY_CHLIDREN) {
    patchMountChildren(children, elm, parentComponent, patch);
  }
}

export function patchMountChildren(
  children: Array<any>,
  elm: any,
  parenComponent: any,
  patch: Function
) {
  children.forEach((vnode) => {
    patch(vnode, elm, parenComponent);
  });
}

