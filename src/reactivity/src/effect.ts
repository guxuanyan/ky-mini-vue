/**
 *
 * @abstract ReactiveEffect
 */

class ReactiveEffect {
    private _fn: Function
    constructor(fn: Function, public options?: any) {
        this._fn = fn
    }
    _run() {
        activeEffect = this
        return this._fn()
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
        if (effect.options.scheduler) {
            effect.options.scheduler()
        } else {
            effect._run()
        }

    }
}
let activeEffect: any
export function effect(fn: Function, options: any = {}): any {
    const _effect = new ReactiveEffect(fn, options)
    _effect._run()
    return _effect._run.bind(_effect)
}

