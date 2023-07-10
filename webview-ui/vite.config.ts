import { fileURLToPath, URL } from "url";
import { defineConfig, loadEnv } from "vite";
import { resolve } from "path";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { createSvg } from "./src/components/svgIcon/index";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  let build = {};
  if (mode == "lib") {
    build = {
      lib: {
        entry: resolve(__dirname, "src/lib.ts"),
        formats: ["es"],
        name: "ComponentsDetect",
        fileName: "detect",
      },
    };
  } else {
    build = {
      outDir: "build",
      rollupOptions: {
        output: {
          entryFileNames: `assets/[name]-[hash].js`,
          chunkFileNames: `assets/[name]-[hash].js`,
          assetFileNames: `assets/[name]-[hash].[ext]`,
        },
      },
    };
  }
  return {
    plugins: [vue(), vueJsx(), createSvg("./src/icons/svg/")],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    base: "./",
    build,
  };
});
