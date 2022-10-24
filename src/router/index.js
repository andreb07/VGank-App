import { createRouter, createWebHistory } from 'vue-router';
import VgHome from '../views/VgHome.vue';
import VgUntagged from '../views/VgUntagged.vue';
import VgReported from '../views/VgReported.vue';
import VgFavorites from '../views/VgFavorites.vue';
import VgVideo from '../views/VgVideo.vue';
import VgEdit from '../views/VgEdit.vue';
import VgAbout from '../views/VgAbout.vue';
import VgPrivacy from '../views/VgPrivacy.vue';
import VgCookies from '../views/VgCookies.vue';

const routes = [
  {
    path: '/',
    name: 'Homepage',
    components: {
      main: VgHome
    }
  },
  {
    path: '/untagged',
    name: 'Untagged',
    components: {
      main: VgUntagged
    }
  },
  {
    path: '/reported',
    name: 'Reported',
    components: {
      main: VgReported
    }
  },
  {
    path: '/edit/:id',
    name: 'Edit',
    components: {
      main: VgEdit
    }
  },
  {
    path: '/favorites',
    name: 'Favorites',
    components: {
      main: VgFavorites
    }
  },
  {
    path: '/about',
    name: 'About',
    components: {
      main: VgAbout
    }
  },
  {
    path: '/privacy',
    name: 'Privacy',
    components: {
      main: VgPrivacy
    }
  },
  {
    path: '/cookies',
    name: 'Cookies',
    components: {
      main: VgCookies
    }
  },
  {
    path: '/video/:id',
    name: 'Video',
    components: {
      video: VgVideo,
      main: VgHome
    }
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
