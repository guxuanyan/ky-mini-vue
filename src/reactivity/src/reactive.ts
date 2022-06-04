/**
 *
 * @returns {Proxy}
 * @description
 * ?返回一个Proxy 触发get的时候收集依赖，触发set的时候触发依赖
 *
 *
 *
 */


import { readonlyHandlers, mutableHandlers } from "./baseHandler"


export function reactive(raw: any): any {
    return createProxyObject(raw, mutableHandlers)
}


export function readonly(raw: any): any {
    return createProxyObject(raw, readonlyHandlers)
}


function createProxyObject(raw: any, ProxyHandlers: any) {
    return new Proxy(raw, ProxyHandlers)
}