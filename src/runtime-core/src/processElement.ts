/**
 * 处理DOM vnode to dom
 */

import { isObject } from "../../tools";
import { patch } from "./render";

export function processElement(vnode: any, container: any) {
  // init or update
  mountElement(vnode, container);
}

function mountElement(vnode: any, container: any) {
  const { type: tag, props, children } = vnode;
  const elm = document.createElement(tag);
  setProps(elm, props);
  setChildren(elm, children);
  container.append(elm);
}


function setProps(elm: any, props: any) {
  // props > string or object
  if (isObject(props)) {
    for (const key in props) {
      const val = props[key];
      if (key == "class" || key == "className") {
        elm.className = Array.isArray(val) ? val.join(" ") : val;
        continue;
      }
      elm.setAttribute(key, val);
    }
  }
}


function setChildren(elm: any, children: any) {
  //  children --->> string or Array
  if (typeof children == "string") {
    elm.textContent = children;
  } else if (Array.isArray(children)) {
    children.forEach((item) => {
      patch(item, elm);
    });
  }
}
