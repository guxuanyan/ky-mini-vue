/**
 *
 * @abstract ReactiveEffect
 */
import { extend } from "../../tools";

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

                          
const targetMap = new Map();
// 收集 effect 的容器 用于 stop 删除
const depsEffect: Array<Set<ReactiveEffect>> = new Array();
// 存储 当前 执行的 effect对象
let activeEffect: any;
// 是否出发了依赖
let shouldTrack = false;
export class ReactiveEffect {
  active = true;
  private _fn: Function;
  onStop: Function = () => {};
  constructor(fn: Function, public scheduler?: any) {
    this._fn = fn;
  }

  _run() {
    // 运行 run 的时候，可以控制 要不要执行后续收集依赖的一步
    // 目前来看的话，只要执行了 fn 那么就默认执行了收集依赖
    // 这里就需要控制了
    // 是不是收集依赖的变量
    // 执行 fn  但是不收集依赖
    if (!this.active) {
      return this._fn();
    }
    // 执行 fn  收集依赖
    // 可以开始收集依赖了
    shouldTrack = true;

    // 执行的时候给全局的 activeEffect 赋值
    // 利用全局属性来获取当前的 effect
    activeEffect = this as any;
    // 执行用户传入的 fn
    console.log("执行用户传入的 fn");
    const result = this._fn();
    // 重置
    shouldTrack = false;
    activeEffect = undefined;

    return result;
  }

  stop() {
    if (this.active) {
      // 如果第一次执行 stop 后 active 就 false 了
      // 这是为了防止重复的调用，执行 stop 逻辑
      cleanupEffect(this);
      if (this.onStop) {
        this.onStop();
      }
      this.active = false;
    }
  }
}

function cleanupEffect(reactiveEffect: any) {
  depsEffect.forEach((dep: any) => {
    if (dep.has(reactiveEffect)) {
      dep.delete(reactiveEffect);
    }
  });
}

// 收集依赖
export function track(target: any, key: any): any {
  if (!isTracking()) return;

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
// 触发依赖
export function trigger(target: any, key: any): any {
  const depMap = targetMap.get(target);
  if (!depMap) return;
  const dep = depMap.get(key);
  if (!dep) return;
  triggerEffects(dep);
}

export function isTracking() {
  return shouldTrack && activeEffect !== undefined;
}

export function triggerEffects(deps: any) {
  for (const effect of deps) {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect._run();
    }
  }
}

export function effect(fn: Function, options: any = {}): any {
  let _effect = new ReactiveEffect(fn, options.scheduler);
  extend(_effect, options);
  _effect._run();
  const runner: any = _effect._run.bind(_effect);
  runner.effect = _effect;
  return runner;
}

export function stop(runner: any) {
  runner.effect.stop();
}
