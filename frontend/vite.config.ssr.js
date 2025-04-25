// frontend/vite.config.ssr.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    ssr: true,
    outDir: "dist/server",
    rollupOptions: {
      input: "/src/entry-server.jsx",
      output: {
        format: "esm",
      },
    },
  },
  ssr: {
    noExternal: ["axios", "@tanstack/react-query"],
  },
});
