import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default () => {
  return defineConfig({
    root: "./src",
    base: "",
    plugins: [tsconfigPaths(), react()],
    // base: "/zapps/2452219874218595057/",
    define: {
    "process.env": {
      BASE_URL: "/zapps/2452219874218595057/",
    },
  },
  build: {
    outDir: "www",
    rollupOptions: {
      output: {
        entryFileNames: "assets/[name].module.js",
        assetFileNames: "assets/[name].[ext]",
      },
    },
    cssCodeSplit: false,
  },
  });
};
