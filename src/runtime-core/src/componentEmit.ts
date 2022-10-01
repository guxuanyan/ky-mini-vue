import { cnamelize, toHandleKey } from "../../tools";

export function emit(instance: any, event: string, ...args: Array<any>) {
  const { props } = instance;
  //   handle event name
  let handlerName = toHandleKey(cnamelize(event));
  const handles = Reflect.get(props, handlerName);
  handles && handles(...args);
}
