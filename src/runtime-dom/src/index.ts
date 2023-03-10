import { createRenderer } from "../../runtime-core";
import { isObject, extend, getEventName, isOn, isFunction } from "../../tools";

export function isEvent(event: any, cb: any) {
  return isOn(event) && isFunction(cb);
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

function handleEvent(elm: any, event: string, cb: any) {
  elm.addEventListener(getEventName(event), cb);
}

function createElement(tag: any) {
  return document.createElement(tag);
}

function insert(elm: any, parent: any) {
  parent.append(elm);
}

function patchProps(elm: any, props: any) {
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

const renderder: any = createRenderer({ createElement, insert, patchProps });

export function createApp(...args: any[]) {
  return renderder.createApp(...args);
}
