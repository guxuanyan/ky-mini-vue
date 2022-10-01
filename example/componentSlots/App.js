import { h } from "../../libs/dist/build-mini-vue.esm.js";
import Foo from "./Foo.js";
export default {
  name: "App",
  render() {
    const app = h("h1", {}, "app");
    // 多个个插槽
    // const foo = h(Foo, {}, [h("b", {}, "123"), h("b", {}, "456")]);
    // 单个插槽
    // const foo = h(Foo, {}, h("b", {}, "123"));
    // 具名插槽
    const foo = h(
      Foo,
      {},
      {
        header: () => h("header", {}, "header"),
        footer: ({name}) => h("footer", {}, "footer-name: " + name),
      }
    );
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
          "implement： " + this.msg
        ),
        h(
          "span",
          {
            class: ["blue", "content"],
            style: {
              "margin-left": "2em",
            },
          },
          "需要" + this.implement.join("、") + "核心模块。"
        ),
        h("div", {}, [app, foo]),
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
