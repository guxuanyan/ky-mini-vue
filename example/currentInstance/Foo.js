import { h, getCurrentInstance } from "../../libs/dist/build-mini-vue.esm.js";
export default {
  name: "Foo",
  render() {
    return h("h2", { class: "blue" }, "Foo.js");
  },

  setup() {
    const instance = getCurrentInstance();
    console.log("Foo, instance", instance);
    return {};
  },
};
