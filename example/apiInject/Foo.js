import {
  createTextVNode,
  h,
  inject,
  provide,
} from "../../libs/dist/build-mini-vue.esm.js";

const FooChildComponent = {
  name: "FooChild",
  setup() {
    return {
      componentData: inject("componentData", "defaultVal/FooChild.js"),
    };
  },

  render() {
    return h("div", { class: "FooChild" }, [
      createTextVNode("FoolChild.Text: "),
      h("h2", { style: { color: "skyblue" } }, this.componentData),
    ]);
  },
};

export default {
  name: "Foo",
  setup() {
    provide("componentData", "Foo组件的value");
    return {
      componentData: inject("componentData", "defaultVal/Foo.js"),
    };
  },
  render() {
    return h("div", { class: "Foo" }, [
      createTextVNode("Foo.js:"),
      h("h2", { style: { color: "skyblue" } }, this.componentData),
      h(FooChildComponent),
    ]);
  },
};
