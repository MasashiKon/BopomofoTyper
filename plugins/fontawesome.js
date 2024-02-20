import { library, config } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faVolumeHigh, faVolumeLow, faVolumeXmark } from '@fortawesome/free-solid-svg-icons'
import { faXTwitter, faFacebook, faMastodon } from '@fortawesome/free-brands-svg-icons'

library.add(faVolumeHigh, faVolumeLow, faVolumeXmark, faXTwitter, faFacebook, faMastodon )

// This is important, we are going to let Nuxt worry about the CSS
config.autoAddCss = false

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('font-awesome-icon', FontAwesomeIcon, {})
})