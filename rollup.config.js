import typescript from "@rollup/plugin-typescript";
export default {
  input: "./src/main.ts",
  output: [
    {
      file: "./libs/dist/build-mini-vue.cjs.js",
      format: "cjs",
    },
    {
      file: "./libs/dist/build-mini-vue.esm.js",
      format: "es",
    },
  ],
  plugins: [typescript()],
};
