import { h } from "../../libs/dist/build-mini-vue.esm.js";

export default {
  name: "Foo",
  setup(props) {
    props.count++;
  },
  render() {
    return h("h2", { style: { color: "skyblue" } }, "component child Foo.js: " + this.count);
  },
};
