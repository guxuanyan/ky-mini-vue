import { track, trigger } from "./effect"



export function createGetter(isReadonly: Boolean = false) {
    return function (target: any, key: any) {
        if (!isReadonly) {
            track(target, key)
        }
        return Reflect.get(target, key)
    }
}

export function createSetter() {
    return function (target: any, key: any, value: any) {
        const result = Reflect.set(target, key, value)
        trigger(target, key)
        return result
    }
}


export const get = createGetter()
export const set = createSetter()
export const readonlyGet = createGetter(true)






