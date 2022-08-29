import { h } from "../../libs/dist/build-mini-vue.esm.js";

export default {
  render() {
    return h(
      "div",
      {
        id: "root",
      },
      //  ----- string
      // "hello " + this.msg
      //  ----- array > {type, props, children}
      [
        {
          type: "h1",
          props: {
            className: ["red", "head", "title"],
          },
          children: "title",
        },
        {
          type: "span",
          props: {
            className: ["content", "blue"],
          },
          //  children --> string || array
          children: "content",
        },
      ]
    );
  },

  setup() {
    return {
      msg: "mini-vue",
    };
  },
};
