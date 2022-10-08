import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import store from './store';
import '@/scss/main.scss';
import { createHead } from "@vueuse/head";

const head = createHead();
const app = createApp(App)
  .use(router)
  .use(store)
  .use(head)
  
router.isReady().then(() => {
  app.mount('#vg-app');
});