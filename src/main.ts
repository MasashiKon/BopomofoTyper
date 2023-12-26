import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import i18n from './localization/i18n'

const app = createApp(App)

app.use(createPinia())
app.use(router)

i18n(app).mount('#app')
