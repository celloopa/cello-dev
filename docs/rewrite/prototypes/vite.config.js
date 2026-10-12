import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  base: "/",
  build: {
    target: "es2022",
    rollupOptions: {
      input: {
        index: resolve(import.meta.dirname, "index.html"),
        home: resolve(import.meta.dirname, "home.html"),
        asheville: resolve(import.meta.dirname, "asheville.html"),
      },
    },
  },
  server: { port: 4610, strictPort: true },
  preview: { port: 4611, strictPort: true },
});
