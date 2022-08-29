function createVNode(type, props, children) {
    const vnode = {
        type,
        props,
        children,
    };
    return vnode;
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

const isObject = (val) => {
    return val !== null && typeof val == "object";
};

function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
    };
    return component;
}
function setupComponent(instance) {
    // TODO
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
    // TODO
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
    // 调用组件setup
    setupComponent(instance);
    // 调用render
    setupRenderEffect(instance, container);
}
function setupRenderEffect(instance, container) {
    // call 后续参数传入参数列表
    const subTree = instance.render.call(instance.setupState);
    patch(subTree, container);
}

/**
 * 处理DOM vnode to dom
 */
function processElement(vnode, container) {
    // init or update
    mountElement(vnode, container);
}
function mountElement(vnode, container) {
    const { type: tag, props, children } = vnode;
    const elm = document.createElement(tag);
    setProps(elm, props);
    setChildren(elm, children);
    container.append(elm);
}
function setProps(elm, props) {
    // props > string or object
    if (isObject(props)) {
        for (const key in props) {
            const val = props[key];
            if (key == "class" || key == "className") {
                elm.className = Array.isArray(val) ? val.join(" ") : val;
                continue;
            }
            elm.setAttribute(key, val);
        }
    }
}
function setChildren(elm, children) {
    //  children --->> string or Array
    if (typeof children == "string") {
        elm.textContent = children;
    }
    else if (Array.isArray(children)) {
        children.forEach((item) => {
            patch(item, elm);
        });
    }
}

function render(vnode, container) {
    // 处理虚拟Dom
    patch(vnode, container);
}
function patch(vnode, container) {
    handleProcessEffect(vnode, container);
}
function handleProcessEffect(vnode, container) {
    if (typeof vnode.type == "string") {
        // 处理Dom
        processElement(vnode, container);
    }
    else if (isObject(vnode.type)) {
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
