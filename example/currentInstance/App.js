import { h, getCurrentInstance } from "../../libs/dist/build-mini-vue.esm.js";
import Foo from "./Foo.js";
export default {
  name: "App",
  render() {
    return h("div", { class: "red" }, [h("h1", {}, "App.js"), h(Foo)]);
  },

  setup() {
    const instance = getCurrentInstance();
    console.log("App, instance", instance);
    return {};
  },
};
