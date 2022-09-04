'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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

function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {},
        proxy: null,
    };
    return component;
}
function setupComponent(instance) {
    // TODO:
    // initProps
    // initSlots
    // vue3 里除了有状态的组件还有函数组件（没有状态）
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    const Component = instance.type;
    const { setup } = Component;
    if (setup) {
        // function == > render fn or Object
        const setupResult = setup();
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    // TODO:
    // function
    if (typeof setupResult == "object") {
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
        if (key in instance.setupState) {
            return Reflect.get(instance.setupState, key);
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

exports.createApp = createApp;
exports.h = h;
