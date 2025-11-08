// Documentation: https://vitejs.dev/config/
import { defineConfig } from "vite";

export default defineConfig(() => {
  const config = {
    build: { outDir: "published" },
    assetsInclude: ["**/*.md"],
    clearScreen: false,
    plugins: [
      {
        // reload page for every change in the directory to ensure the latest version is displayed
        // Documentation: https://vitejs.dev/guide/api-plugin.html#handlehotupdate
        name: "hmr-full-reload",
        handleHotUpdate({ file, server }) {
          const extensions_that_trigger_reload = [
            "css",
            "gif",
            "jpeg",
            "jpg",
            "md",
            "png",
            "svg",
          ];
          const extension = file.split(".");
          if (
            extensions_that_trigger_reload.includes(
              extension[extension.length - 1].toLowerCase(),
            )
          ) {
            console.info("File changed, reloading: ", file);
            server.ws.send({ type: "full-reload" });
          }
          return [];
        },
      },
    ],
    server: {
      allowedHosts: [
        ".localhost",
        ".trycloudflare.com",
      ],
      proxy: {
        "/token": {
          target: "http://localhost:1948/token",
          ignorePath: true,
        },
        "/socket.io": {
          target: "ws://localhost:1948/",
          ws: true,
          // ignorePath: true,
          rewriteWsOrigin: true,
        },
      },
    },
  };
  if (process.env.SERVING_SLIDESDOWN == "1") {
    // configuration active inside docker container via SERVING_SLIDESDOWN variable
    return {
      ...config,
      server: {
        ...config.server,
        open: false,
        host: true,
        port: 8080,
        strictPort: true,
        fs: {
          strict: true,
        },
      },
    };
  } else {
    return config;
  }
});
