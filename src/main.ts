import { createApp } from 'vue'
import App from './App.vue'
import { setupI18n } from './locales'
import { setupAssets } from './plugins'
import { setupRouter } from './router'
import { setupStore } from './store'

async function bootstrap() {
  const app = createApp(App)
  setupAssets()

  setupStore(app)

  setupI18n(app)

  await setupRouter(app)

  app.mount('#app')
}

bootstrap()
