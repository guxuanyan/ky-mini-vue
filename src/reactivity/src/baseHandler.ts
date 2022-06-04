import { track, trigger } from "./effect"

const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)


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




export const mutableHandlers = {
    get,
    set
}

export const readonlyHandlers = {
    get: readonlyGet,
    set(target: any, key: any) {
        console.warn(`
                Cannot be modified because it is read-only：${target}
            `)
        return Reflect.get(target, key)
    }
}



