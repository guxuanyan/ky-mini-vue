import { h, provide } from "../../libs/dist/build-mini-vue.esm.js";
import Foo from "./Foo.js";
export default {
  name: "App",
  render() {
    return h("div", {}, [h(Foo)]);
  },

  setup() {
    provide("componentData", "App Value : app组件的value");
    return {};
  },
};
