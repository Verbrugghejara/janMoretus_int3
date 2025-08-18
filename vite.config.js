import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/janMoretus_int3/",
  plugins: [tailwindcss()],
});
