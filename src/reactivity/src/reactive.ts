/**
 *
 * @returns {Proxy}
 * @description
 * ?返回一个Proxy 触发get的时候收集依赖，触发set的时候触发依赖
 *
 *
 *
 */
import { track, trigger } from "./effect"
export function reactive(raw: any): any {

    return new Proxy(raw, {
        get(target, key) {
            track(target, key)
            return Reflect.get(target, key)
        },

        set(target, key, value) {
            const result = Reflect.set(target, key, value)
            trigger(target, key)
            return result
        }
    })

}