// framework
import { createApp } from 'vue'
import App from './App.vue'

// styles
import '@unocss/reset/tailwind.css'
import 'uno.css'
import './assets/styles/index.css'
import 'tippy.js/dist/tippy.css'

// 3rd party
import { router } from './pages/router'
import { createPinia } from 'pinia'

const pinia = createPinia()
const app = createApp(App)

app.use(router).use(pinia)
app.mount('#app')
