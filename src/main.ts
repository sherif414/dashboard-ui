import { createApp } from 'vue'
import { router } from './pages/router'
import App from './App.vue'
import '@unocss/reset/tailwind.css'
import 'uno.css'
import { createPinia } from 'pinia'

const pinia = createPinia()
const app = createApp(App)

app.use(router).use(pinia)
app.mount('#app')
