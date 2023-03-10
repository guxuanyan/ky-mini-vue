import { h } from "../../libs/dist/build-mini-vue.esm.js";

export default {
  name: "App",
  setup() {
    return { x: 100, y: 200 };
  },
  render() {
    return h("rect", { x: this.x, y: this.y });
  },
};
