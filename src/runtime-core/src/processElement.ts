/**
 * 处理DOM vnode to dom
 */

import { extend, isObject } from "../../tools";
import { patch } from "./render";

export function processElement(vnode: any, container: any) {
  // init or update
  mountElement(vnode, container);
  // TODO: update
}

function mountElement(initialVNode: any, container: any) {
  const { type: tag, props, children } = initialVNode;
  const elm = document.createElement(tag);
  handleProps(elm, props);
  mountChildren(elm, children);
  initialVNode.elm = elm;
  container.append(elm);
}

function handleProps(elm: any, props: any) {
  // props > string or object
  if (isObject(props)) {
    for (const key in props) {
      const val = props[key];
      //   class ==> array or string
      setAttribute(elm, key, val);
    }
  }
}

function mountChildren(elm: any, children: any) {
  //  children --->> string or Array
  if (typeof children == "string") {
    elm.textContent = children;
  } else if (Array.isArray(children)) {
    children.forEach((item) => {
      patch(item, elm);
    });
  }
}

const publicPropHandles = {
  class: (elm: any, val: any) => (Array.isArray(val) ? val.join(" ") : val),
  style: (elm: any, val: any) =>
    typeof isObject(val) ? extend(elm.style, val) : val,
};

function setAttribute(elm: any, key: string, val: any): any {
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
