import { isArray } from "../../tools";
import { ShapeFlags } from "../../tools/ShapeFlags";

export function initSlots(instance: any) {
  const { vnode } = instance;
  if (vnode.shapeFlags & ShapeFlags.SLOTS_CHILDREN) {
    nomalizeObjectSlots(vnode.children, instance);
  }
}

interface SlotsObject {
  [key: string]: any;
}
function nomalizeObjectSlots(children: any, instance: any) {
  const slots: SlotsObject = {};
  for (const key in children) {
    const value = children[key];
    const fn = (props: any) => nomalizeSlotValue(value(props));
    Reflect.set(slots, key, fn);
  }
  instance.slots = slots;
}

function nomalizeSlotValue(val: any) {
  return isArray(val) ? val : [val];
}
