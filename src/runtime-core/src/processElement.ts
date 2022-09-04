/**
 * 处理DOM vnode to dom
 */

import { extend, getEventName, isFunction, isObject, isOn } from "../../tools";
import { ShapeFlags } from "../../tools/ShapeFlags";
import { patch } from "./render";

export function processElement(vnode: any, container: any) {
  // init or update
  mountElement(vnode, container);
  // TODO: update
}


function mountElement(initialVNode: any, container: any) {
  const { type: tag, props, children, shapeFlags } = initialVNode;
  const elm = document.createElement(tag);
  handleProps(elm, props);

  mountChildren(elm, children, shapeFlags);
  initialVNode.elm = elm;
  container.append(elm);
}


function handleProps(elm: any, props: any) {
  // props > string or object
  if (isObject(props)) {
    for (const key in props) {
      const val = props[key];
      if (isEvent(key, val)) {
        handleEvent(elm, key, val);
      } else {
        handleAttributes(elm, key, val);
      }
    }
  }
}


function mountChildren(elm: any, children: any, shapeFlags: any) {
  //  children --->> string or Array
  if (shapeFlags & ShapeFlags.TEXT_CHLIDREN) {
    elm.textContent = children;
  } else if (shapeFlags & ShapeFlags.ARRAY_CHLIDREN) {
    patchMountChildren(children, elm);
  }
}


function patchMountChildren(children: Array<any>, elm: any) {
  children.forEach((item) => {
    patch(item, elm);
  });
}


const publicPropHandles = {
  class: (elm: any, val: any) => (Array.isArray(val) ? val.join(" ") : val),
  style: (elm: any, val: any) =>
    typeof isObject(val) ? extend(elm.style, val) : val,
};


function handleAttributes(elm: any, key: string, val: any): any {
  // class ==> array or string
  const handlePublicFn = Reflect.get(publicPropHandles, key);
  let result = "";
  if (handlePublicFn) {
    result = handlePublicFn(elm, val);
    if (typeof result != "string") return;
  } else {
    result = val;
  }
  elm.setAttribute(key, result);
}

/**
 * 命名 onC 是一on开头且三个字母大写
 * @param event  事件名称
 * @param cb  回调函数
 * @returns
 */
function isEvent(event: any, cb: any) {
  return isOn(event) && isFunction(cb);
}
function handleEvent(elm: any, event: string, cb: any) {
  elm.addEventListener(getEventName(event), cb);
}
