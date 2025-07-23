// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  tailwindcss: { viewer: true, exposeConfig: true },

  app: {
    baseURL: "/dune/",
    buildAssetsDir: '/_nuxt/',
  },
  
  // 靜態生成設定
  nitro: {
    preset: 'github-pages',
    prerender: {
      routes: ['/']
    }
  },
  
  // 確保 SPA 模式用於 GitHub Pages
  ssr: false
})