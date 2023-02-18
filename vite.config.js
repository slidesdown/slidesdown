// Documentation: https://vitejs.dev/config/
import { defineConfig } from "vite";

export default defineConfig(() => {
  const config = {
    build: { outDir: "docs" },
    assetsInclude: ["**/*.md"],
  };
  if (process.env.SERVING_SLIDESDOWN == "1") {
    return {
      ...config,
      clearScreen: false,
      server: {
        host: true,
        port: 8080,
        strictPort: true,
      },
    };
  } else {
    return config;
  }
});
