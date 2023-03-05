import { h } from "../../libs/dist/build-mini-vue.esm.js";
import Foo from "./Foo.js";
export default {
  name: "App",
  render() {
    Reflect.set(window, "self", this);
    return h(
      "div",
      {
        id: "root",
      },

      //  ----- string
      // "hello " + this.msg
      //  ----- array > {type, props, children}
      [
        h(
          "h1",
          {
            class: ["red", "title"],
            style: {
              color: "pink",
            },
            onClick(e) {
              console.log("click", e);
            },
          },
          "实现的东西： " + this.msg
        ),
        h(
          "span",
          {
            class: ["blue", "content"],
            style: {
              "margin-left": "2em",
            },
          },
          "核心模块：" + this.implement.join("、") + ""
        ),
        h(Foo, {
          msg: "这是组件类型",
          count: 1,
        }),
      ]
    );
  },

  setup() {
    return {
      msg: "mini-vue",
      implement: ["reactive", "runtime-core", "compiler"],
    };
  },
};
