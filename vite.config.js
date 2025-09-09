import { defineConfig } from "vite";
import wasm from "vite-plugin-wasm";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue(), wasm()],
});
