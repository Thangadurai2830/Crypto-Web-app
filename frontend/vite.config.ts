/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { securityHeadersPlugin } from "./vite-security-headers";

export default defineConfig({
  plugins: [react(), securityHeadersPlugin()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "vitest.setup.ts", "**/*.d.ts", "**/*.config.*"],
    },
    exclude: ["node_modules", "e2e"],
  },
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        ws: true,
        // Forward /api/v1/... to backend as /api/v1/... (no rewrite)
      },
    },
  },
  build: {
    target: "esnext",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            if (id.includes("react-dom") || id.includes("react/")) return "react";
            if (id.includes("recharts")) return "recharts";
            if (id.includes("framer-motion")) return "framer-motion";
            if (id.includes("@tanstack")) return "tanstack";
            if (id.includes("react-router")) return "router";
            if (id.includes("axios")) return "axios";
            return "vendor";
          }
        },
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },
    minify: "esbuild",
    cssCodeSplit: true,
  },
});
