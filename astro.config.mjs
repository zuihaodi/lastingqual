import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import keystatic from "@keystatic/astro";

const isDev = process.env.NODE_ENV !== "production";

export default defineConfig({
  integrations: isDev ? [tailwind(), react(), keystatic()] : [tailwind(), react()],
  vite: {
    cacheDir: ".vite-local",
  },
  i18n: {
    defaultLocale: "zh",
    locales: ["zh", "en"],
    routing: {
      prefixDefaultLocale: false
    }
  }
});
