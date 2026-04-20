import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import tailwind from "@astrojs/tailwind";
import keystatic from "@keystatic/astro";

export default defineConfig({
  output: "server",
  adapter: cloudflare({
    workerEntryPoint: {
      path: "./src/worker-entrypoint.ts",
    },
  }),
  integrations: [tailwind(), keystatic()],
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
