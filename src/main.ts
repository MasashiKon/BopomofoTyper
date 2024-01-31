import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import i18n from './localization/i18n'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faVolumeHigh, faVolumeLow, faVolumeXmark } from '@fortawesome/free-solid-svg-icons'
import { faXTwitter, faFacebook, faMastodon } from '@fortawesome/free-brands-svg-icons'

const scriptResponsivevoice = document.createElement('script')
scriptResponsivevoice.src = import.meta.env.DEV
  ? 'https://code.responsivevoice.org/responsivevoice.js?key=YM2FQ2BY'
  : `https://code.responsivevoice.org/responsivevoice.js?key=${import.meta.env.VITE_RV_APIKEY}`
document.body.appendChild(scriptResponsivevoice)

library.add(faVolumeHigh, faVolumeLow, faVolumeXmark, faXTwitter, faFacebook, faMastodon)

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.component('font-awesome-icon', FontAwesomeIcon)

i18n(app).mount('#app')
