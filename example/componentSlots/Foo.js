import { h, renderSlots } from "../../libs/dist/build-mini-vue.esm.js";
export default {
  name: "Foo",
  setup() {
    return {
      a: 2,
    };
  },
  render() {
    //  具名插槽
    const name = "kyle";
    return h("div", {}, [
      renderSlots(this.$slots, "header"),
      h("hr", {}, "这是一条分割线"),
      // 作用域插槽
      renderSlots(this.$slots, "footer", { name }),
    ]);
  },
};
