import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        // This will transform your SVG to a React component
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
  ],
  server: {
    proxy: {
      // Proxy API calls during development to avoid CORS issues.
      // Requests to /dashboard/* will be forwarded to https://api.mastrokart.com
      "/dashboard": {
        target: "https://api.mastrokart.com",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path, // keep path as-is
      },
    },
  },
});
