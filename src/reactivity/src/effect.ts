/**
 *
 * @abstract ReactiveEffect
 */

class ReactiveEffect {
    private _fn: Function
    constructor(fn: Function) {
        this._fn = fn
    }
    _run() {

        activeEffect = this
        this._fn()
    }
}
// 全局容器
/**
 *
 * targetMap
 * 存储
 * [] 其中为描述词
 * {
 *  [target]: {
 *      [key]: new Set([
 *          [effect]
 *      ])
 *   }
 * }
 * dep 存储所有的fn
 */
const targetMap = new Map()
// 收集依赖
export function track(target: any, key: any): any {
    let depsMap = targetMap.get(target)
    if (!depsMap) {
        depsMap = new Map()
        targetMap.set(target, depsMap)
    }
    let deps = depsMap.get(key)
    if (!deps) {
        deps = new Set()
        depsMap.set(key, deps)
    }
    trackEffects(deps)
}
function trackEffects(deps: any): any {
    !deps.has(activeEffect) && deps.add(activeEffect)
}
/**
 * @description
 * 触发依赖
 */
export function trigger(target: any, key: any): any {
    const depMap = targetMap.get(target)
    const deps = depMap.get(key)
    for (const effect of deps) {
        effect._run()
    }
}
let activeEffect: any
export function effect(fn: Function): any {
    const _effect = new ReactiveEffect(fn)
    _effect._run()
}

