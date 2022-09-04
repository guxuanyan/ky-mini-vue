const extend = Object.assign;
const isObject = (val) => {
    return val !== null && typeof val == "object";
};
function isString(val) {
    return typeof val == "string";
}
function isArray(val) {
    return Array.isArray(val);
}
const isOn = (str) => /on[A-Z]/.test(str);
function getEventName(str) {
    return str.slice(2).toLowerCase();
}
const isFunction = (fn) => typeof fn == "function";
const hasOwn = (target, key) => target.hasOwnProperty(key);

function createVNode(type, props, children) {
    const vnode = {
        type,
        props,
        children,
        elm: null,
        shapeFlags: getTypeShapeFlags(type),
    };
    getChildrenShapeFlags(children, vnode);
    return vnode;
}
function getTypeShapeFlags(type) {
    return typeof type == "string"
        ? 1 /* ELEMENT */
        : 2 /* STATEFUL_COMPONENT */;
}
function getChildrenShapeFlags(children, vnode) {
    // children 的值
    if (isString(children)) {
        vnode.shapeFlags |= 4 /* TEXT_CHLIDREN */;
    }
    else if (isArray(children)) {
        vnode.shapeFlags |= 8 /* ARRAY_CHLIDREN */;
    }
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

/**
 *
 * @abstract ReactiveEffect
 */
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
new Array();
// 触发依赖
function trigger(target, key) {
    const depMap = targetMap.get(target);
    if (!depMap)
        return;
    const dep = depMap.get(key);
    if (!dep)
        return;
    triggerEffects(dep);
}
function triggerEffects(deps) {
    for (const effect of deps) {
        if (effect.scheduler) {
            effect.scheduler();
        }
        else {
            effect._run();
        }
    }
}

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);
function createGetter(isReadonly = false, isShallow = false) {
    return function (target, key) {
        if (key == "__is-readonly" /* ISREADONLY */) {
            return isReadonly;
        }
        if (key == "__is_reactive" /* ISREACTIVE */) {
            return !isReadonly;
        }
        const res = Reflect.get(target, key);
        if (isShallow) {
            return res;
        }
        if (isObject(res)) {
            return isReadonly ? readonly(res) : reactive(res);
        }
        return res;
    };
}
function createSetter(shallow = false) {
    return function (target, key, value) {
        if (shallow == true) {
            return;
        }
        const result = Reflect.set(target, key, value);
        trigger(target, key);
        return result;
    };
}
const mutableHandlers = {
    get,
    set,
};
const readonlyHandlers = {
    get: readonlyGet,
    set(target, key) {
        console.warn(`Cannot be modified because it is read-only：${JSON.stringify(target)}`);
        return Reflect.get(target, key);
    },
};
const shallowReadonlyHandles = extend({}, readonlyHandlers, {
    get: shallowReadonlyGet,
});

/**
 *
 * @returns {Proxy}
 * @description
 * ?返回一个Proxy 触发get的时候收集依赖，触发set的时候触发依赖
 *
 *
 *
 */
function reactive(raw) {
    return createProxyObject(raw, mutableHandlers);
}
function readonly(raw) {
    return createProxyObject(raw, readonlyHandlers);
}
function createProxyObject(raw, ProxyHandlers) {
    return new Proxy(raw, ProxyHandlers);
}
function shallowReadonly(raw) {
    // raw
    return createProxyObject(raw, shallowReadonlyHandles);
}

function initProps(instance) {
    instance.props = instance.vnode.props || {};
}

function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {},
        proxy: null,
        props: null,
    };
    return component;
}
function setupComponent(instance) {
    // TODO:
    // initProps
    initProps(instance);
    // initSlots
    // vue3 里除了有状态的组件还有函数组件（没有状态）
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    const Component = instance.type;
    const { setup } = Component;
    if (setup) {
        // function == > render fn or Object
        const setupResult = setup(shallowReadonly(instance.props));
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    // TODO:
    // function
    if (isObject(setupResult)) {
        instance.setupState = setupResult;
    }
    // 查看是不是有 render
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    const Component = instance.type;
    if (Component.render) {
        instance.render = Component.render;
    }
}

const componentHandlesImpl = {
    $el: (instance) => Reflect.get(instance.vnode, "elm"),
    $data: (instance) => Reflect.get(instance, "setupState"),
};
const publicInstanceProxyHandles = {
    get(target, key) {
        const instance = Reflect.get(target, "_");
        const { setupState, props } = instance;
        if (hasOwn(setupState, key)) {
            return Reflect.get(setupState, key);
        }
        else if (hasOwn(props, key)) {
            return Reflect.get(props, key);
        }
        const componentHandlesResult = Reflect.get(componentHandlesImpl, key);
        if (componentHandlesResult) {
            return componentHandlesResult(instance);
        }
    },
};

/**
 * 处理组件
 */
function processComponent(vnode, container) {
    // 挂载组件
    mountComponent(vnode, container);
}
function mountComponent(vnode, container) {
    // 创建组件实例
    const instance = createComponentInstance(vnode);
    // 设置组件代理
    Reflect.set(instance, "proxy", new Proxy({ _: instance }, publicInstanceProxyHandles));
    // 调用组件setup
    setupComponent(instance);
    // 调用render
    setupRenderEffect(instance, container, vnode);
}
function setupRenderEffect(instance, container, vnode) {
    // call 后续参数传入参数列表
    // subTree == root element
    const { proxy } = instance;
    const subTree = instance.render.call(proxy);
    patch(subTree, container);
    vnode.elm = subTree.elm;
}

/**
 * 处理DOM vnode to dom
 */
function processElement(vnode, container) {
    // init or update
    mountElement(vnode, container);
    // TODO: update
}
function mountElement(initialVNode, container) {
    const { type: tag, props, children, shapeFlags } = initialVNode;
    const elm = document.createElement(tag);
    handleProps(elm, props);
    mountChildren(elm, children, shapeFlags);
    initialVNode.elm = elm;
    container.append(elm);
}
function handleProps(elm, props) {
    // props > string or object
    if (isObject(props)) {
        for (const key in props) {
            const val = props[key];
            if (isEvent(key, val)) {
                handleEvent(elm, key, val);
            }
            else {
                handleAttributes(elm, key, val);
            }
        }
    }
}
function mountChildren(elm, children, shapeFlags) {
    //  children --->> string or Array
    if (shapeFlags & 4 /* TEXT_CHLIDREN */) {
        elm.textContent = children;
    }
    else if (shapeFlags & 8 /* ARRAY_CHLIDREN */) {
        patchMountChildren(children, elm);
    }
}
function patchMountChildren(children, elm) {
    children.forEach((item) => {
        patch(item, elm);
    });
}
const publicPropHandles = {
    class: (elm, val) => (Array.isArray(val) ? val.join(" ") : val),
    style: (elm, val) => typeof isObject(val) ? extend(elm.style, val) : val,
};
function handleAttributes(elm, key, val) {
    // class ==> array or string
    const handlePublicFn = Reflect.get(publicPropHandles, key);
    let result = "";
    if (handlePublicFn) {
        result = handlePublicFn(elm, val);
        if (typeof result != "string")
            return;
    }
    else {
        result = val;
    }
    elm.setAttribute(key, result);
}
/**
 * 命名 onC 是一on开头且三个字母大写
 * @param event  事件名称
 * @param cb  回调函数
 * @returns
 */
function isEvent(event, cb) {
    return isOn(event) && isFunction(cb);
}
function handleEvent(elm, event, cb) {
    elm.addEventListener(getEventName(event), cb);
}

function render(vnode, container) {
    // 处理虚拟Dom
    patch(vnode, container);
}
function patch(vnode, container) {
    handleProcessEffect(vnode, container);
}
function handleProcessEffect(vnode, container) {
    const { shapeFlags } = vnode;
    if (shapeFlags & 1 /* ELEMENT */) {
        // 处理Dom
        processElement(vnode, container);
    }
    else if (shapeFlags & 2 /* STATEFUL_COMPONENT */) {
        // 处理组件
        processComponent(vnode, container);
    }
}

/**
 *
 * @param rootComponent 组件
 * @returns Object mount
 */
function createApp(rootComponent) {
    return {
        /**
         *
         * @param rootContainer 根元素或元素名
         */
        mount(rootContainer) {
            // component --> 转换为虚拟节点
            const vnode = createVNode(rootComponent);
            const elem = handleRootContainer(rootContainer);
            render(vnode, elem);
        },
    };
}
function handleRootContainer(rootContainer) {
    if (typeof rootContainer == "string") {
        return document.querySelector(rootContainer);
    }
    return rootContainer;
}

export { createApp, h };
