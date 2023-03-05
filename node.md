# reactive && readonly && ref-- > 
## 实现思路
### 一、绑定实例给对象绑定proxy

- getter

    - 判断是不是对象， 如果是对象判断生成的是不是readonly 类型 如果是readonly类型重新调用 readonly function 返回。如果是reactive则调用reactive返回

    - 如果是reactive 出发track 进行收集依赖

    - 如果不是对象 则直接返回

    ```js
    return function (target: any, key: any) {
        if(isObject(target[key])){
            return isReadonly ? readonly(target[key]) : reactive(target[key])
        }

        return Reflect.get(target, key)
    }
    ``` 
- setter

    - 触发时直接修改， 如果时readonly则抛出错误。

    - reactive时触发依赖: trigger()

    ```js
    return function (target: any, key: any, value: any) {
        if(isReadonly) {
            console.warn('不可修改')
            return 
        }
        return Reflect.set(target, key, value)
    }

    ```


# effect
- 传入一个回调函数， 函数中执行了 reacive、ref的读（收集依赖）。函数中执行的reactive、ref修改（触发依赖）。

- 声明时自动执行 effect 传入的 function。执行内部的run函数（收集或触发）。如果收集过的响应式对象发生修改则会执行调用effect中传入的function。

 


# computed



