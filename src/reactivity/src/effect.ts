/**
 *
 * @abstract ReactiveEffect
 */
import { extend } from "../../tools"

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
// 收集 effect 的容器 用于 stop 删除
const depsEffect: Array<Set<ReactiveEffect>> = new Array()
// 存储 当前 执行的 effect对象
let activeEffect: ReactiveEffect

class ReactiveEffect {
    private _fn: Function
    onStop: Function = () => { }
    isStop: Boolean = true
    constructor(fn: Function, public scheduler?: any) {
        this._fn = fn
    }
    _run() {
        activeEffect = this
        return this._fn()
    }

    stop() {
        if (!this.isStop) return
        if (this.onStop) this.onStop()
        cleaupEffects(this)
        this.isStop = false
    }
}

function cleaupEffects(reactiveEffect: any) {
    depsEffect.forEach((dep: any) => {
        if (dep.has(reactiveEffect)) {
            dep.delete(reactiveEffect)
        }
    });
}

// 收集依赖
export function track(target: any, key: any): any {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
        depsMap = new Map();
        targetMap.set(target, depsMap);
    }
    let dep = depsMap.get(key);
    if (!dep) {
        dep = new Set();
        depsMap.set(key, dep);
    }
    trackEffects(dep);
}

export function trackEffects(dep: any) {
    if (dep.has(activeEffect)) return;
    dep.add(activeEffect);
    depsEffect.push(dep);
}
/**
 * @description
 * 触发依赖
 */
export function trigger(target: any, key: any): any {
    const depMap = targetMap.get(target)
    const deps = depMap.get(key)
    triggerEffects(deps)
}

function triggerEffects(deps: any) {
    for (const effect of deps) {
        if (effect.scheduler) {
            effect.scheduler()
        } else {
            effect._run()
        }
    }
}

export function effect(fn: Function, options: any = {}): any {
    let _effect = new ReactiveEffect(fn, options.scheduler)
    extend(_effect, options)
    _effect._run()
    const runner: any = _effect._run.bind(_effect)
    runner.effect = _effect
    return runner
}

export function stop(runner: any) {
    runner.effect.stop()
}