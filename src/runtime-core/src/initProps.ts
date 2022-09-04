export function initProps(instance: any) {
  instance.props = instance.vnode.props || {};
}
