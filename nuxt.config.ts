import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  // My Nuxt config
  pages: true,
  modules: ['@nuxtjs/i18n'],
  imports: {
    autoImport: true
  },
  // @ts-ignore
  i18n: {
    vueI18n: './i18n.config.ts', // if you are using custom path, default
  }
})
