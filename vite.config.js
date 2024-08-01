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
        name: 'hmr-full-reload',
        handleHotUpdate({ server, modules, timestamp }) {
          console.log("reloading")
          server.ws.send({ type: 'full-reload' })
          return []
        }
      }
    ],
    server: {
      proxy: {
        '/token': {
          target: 'http://localhost:1948/token',
          ignorePath: true,
        },
        '/socket.io': {
          target: 'ws://localhost:1948/',
          ws: true,
          // ignorePath: true,
          rewriteWsOrigin: true,
        },
      },
    },
  };
  if (process.env.SERVING_SLIDESDOWN == "1") {
    return {
      ...config,
      server: {
        ...config.server,
        host: true,
        port: 8080,
        strictPort: true,
      },
    };
  } else {
    return config;
  }
});
