import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  app: {
    baseURL: '/jointoit-tw/',
    buildAssetsDir: '/jointoit-tw/_nuxt/'
  },
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  typescript: {
    strict: true,
    typeCheck: true
  },
  // auto import components
  components: true,
  build: {},
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/style/helpers.scss" as *;'
        }
      }
    },
  },
  css:[
    "@/assets/style/main.scss", // contains all global styles
    "@/assets/style/css/font-faces.css",
    "@/assets/style/css/reset.css",
  ],
})
