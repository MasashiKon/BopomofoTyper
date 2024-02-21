import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  // My Nuxt config
  pages: true,
  modules: ['@nuxtjs/i18n'],
  imports: {
    autoImport: true
  },
  css: ['@fortawesome/fontawesome-svg-core/styles.css'],
  runtimeConfig: {
    // The private keys which are only available within server-side
    apiSecret: '123',
    dbUrl: '',
    dbUrlGen: '',
    urlGen: '',
    dbApikey: '',
    // Keys within public, will be also exposed to the client-side
    public: {
      apiBase: '/api',
      VITE_DB_URL: 'test',
      dbUrl: '',
      urlGen: '',
      dbApikey: ''
    }
  },
  // @ts-ignore
  i18n: {
    vueI18n: './i18n.config.ts' // if you are using custom path, default
  }
})
