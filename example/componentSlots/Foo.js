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
      h("b", {}, "string"),
      renderSlots(this.$slots, "footer", { name }),
    ]);
  },
};
