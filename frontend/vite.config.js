import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Allow external access
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
  build: {
    ssr: false, // Client-side build by default
  },
  ssr: {
    // Ensure external dependencies are not bundled in SSR
    noExternal: ["axios", "@tanstack/react-query"],
  },
});
