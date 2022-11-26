import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import store from './store';
import '@/scss/main.scss';
import { createHead } from "@vueuse/head";
import VueMobileDetection from "vue-mobile-detection";

const head = createHead();
const app = createApp(App)
  .use(router)
  .use(store)
  .use(head)
  .use(VueMobileDetection);
  
router.isReady().then(() => {
  app.mount('#vg-app');
});