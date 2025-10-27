import { defineConfig, type UserConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const config: UserConfig = {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@my-project/shared": path.resolve(__dirname, "../shared/src"),
      },
    },
    server: {
      host: true,
      port: 5173,
      watch: {
        usePolling: true,
        interval: 100,
      },
      hmr: {
        host: 'localhost'
      }
    },
  };

  if (command === "build") {
    config.base = "/web-sell-client/";
  }

  return config;
});
