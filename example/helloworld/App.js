import { h } from "../../libs/dist/build-mini-vue.esm.js";

export default {
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
