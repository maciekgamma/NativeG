import { nodeResolve } from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import pkg from "./package.json";

const extensions = [".js", ".jsx", ".ts", ".tsx"];
const external = Object.keys(pkg.dependencies || {});

export default {
  input: "src/index.tsx",
  output: {
    dir: "lib/",
    format: "cjs",
    preserveModules: true,
    assetFileNames: "[name].cjs.[ext]",
  },
  plugins: [
    peerDepsExternal(),
    nodeResolve({
      mainFields: ["module", "main", "jsnext:main", "browser"],
      extensions,
    }),
    commonjs(),
    typescript({
      declarations: true,
    }),
    babel({
      babelHelpers: "bundled",
      include: "src/**/*",
      exclude: "node_modules/**/*",
      presets: [
        "@babel/env",
        "@babel/preset-react",
        "@babel/preset-typescript",
      ],
      extensions,
    }),
  ],
  external,
};
