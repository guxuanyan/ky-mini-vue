import { createRenderer } from "../../libs/dist/build-mini-vue.esm.js";
import App from "./App.js";

const game = new PIXI.Application({
  width: 300,
  height: 300,
  backgroundColor: "#ff8600",
});

document.body.append(game.view);

const renderer = createRenderer({
  createElement(tag) {
    if (tag == "rect") {
      const rect = new PIXI.Graphics();

      rect.beginFill("#000000");
      rect.drawRect(0, 0, 50, 50);
      rect.endFill();

      return rect;
    }
  },
  patchProps(elm, props) {
    for (const key in props) {
      elm[key] = props[key];
    }
  },
  insert(elm, parent) {
    parent.addChild(elm);
  },
});

renderer.createApp(App).mount(game.stage);
