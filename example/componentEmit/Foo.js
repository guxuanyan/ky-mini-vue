import { h } from "../../libs/dist/build-mini-vue.esm.js";

export default {
  name: "Foo",
  setup(props, { emit }) {
    return {
      emitAdd: (...args) => {
        emit("add", 1.23, 3, 2, 3, 45);

        emit("emit-add", 1.23, 3, 2, 3, 45);
      },
    };
  },
  render() {
    const btn = h(
      "button",
      {
        onClick: this.emitAdd,
        style: {
          "margin-top": "30px",
        },
      },
      "click emit event"
    );
    const br = h("br");
    return h("h2", { style: { color: "skyblue" } }, [
      "component child Foo.js: " + this.count,
      br,
      btn,
    ]);
  },
};
