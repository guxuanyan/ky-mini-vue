import { isFunction } from "../../tools";
import { createVNode } from "../src/vnode";

export function renderSlots(slots: any, name: any, props: object) {
  const slot = slots[name];
  if (slot) {
    if (isFunction(slot)) {
      return createVNode("div", {}, slot(props));
    }
  }
}
