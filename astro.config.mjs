import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  // 新增下面这段配置
  i18n: {
    defaultLocale: "zh", // 默认语言是中文
    locales: ["zh", "en"], // 支持中文和英文
    routing: {
        prefixDefaultLocale: false // 中文版不强制加 /zh 前缀（直接访问域名就是中文）
    }
  }
});