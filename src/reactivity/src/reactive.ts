/**
 *
 * @returns {Proxy}
 * @description
 * ?返回一个Proxy 触发get的时候收集依赖，触发set的时候触发依赖
 *
 *
 *
 */

import { isObject } from "../../tools";
import {
  readonlyHandlers,
  mutableHandlers,
  shallowReadonlyHandles,
  ReactiveFlags,
} from "./baseHandler";

export function reactive(raw: any): any {
  return createProxyObject(raw, mutableHandlers);
}

export function readonly(raw: any): any {
  return createProxyObject(raw, readonlyHandlers);
}

export function createProxyObject(raw: any, ProxyHandlers: any) {
  return new Proxy(raw, ProxyHandlers);
}

export function isReadonly(target: any): any {
  return !!target[ReactiveFlags.ISREADONLY];
}

export function isReactive(target: any): any {
  return !!target[ReactiveFlags.ISREACTIVE];
}

export function shallowReadonly(raw: any) {
  // raw
  return createProxyObject(raw, shallowReadonlyHandles);
}

export function isProxy(val: any) {
  return isReactive(val) || isReadonly(val);
}
