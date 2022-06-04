/**
 *
 * @returns {Proxy}
 * @description
 * ?返回一个Proxy 触发get的时候收集依赖，触发set的时候触发依赖
 *
 *
 *
 */


import { get, set, readonlyGet } from "./baseHandler"


export function reactive(raw: any): any {
    return new Proxy(raw, {
        get,
        set
    })
}


export function readonly(raw: any): any {
    return new Proxy(raw, {
        get: readonlyGet,
        set(target: any, key: any) {
            console.warn(`
                Cannot be modified because it is read-only：${target}
            `)
            return Reflect.get(target, key)
        }
    })
}


