import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  resolve: {
    alias: [{
      find: "unocss",
      replacement: resolve(__dirname, "./public/vendor/unocss/core.global.js"),
    }],
  },
});
