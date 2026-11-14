import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base "./" deixa o build funcionar em qualquer pasta (inclusive abrindo o arquivo direto).
export default defineConfig({
  plugins: [react()],
  base: "./",
});
