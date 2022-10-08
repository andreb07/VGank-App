import { createRouter, createWebHistory } from 'vue-router';
import VgHome from '../views/VgHome.vue';
import VgUntagged from '../views/VgUntagged.vue';
import VgReported from '../views/VgReported.vue';
import VgFavorites from '../views/VgFavorites.vue';
import VgVideo from '../views/VgVideo.vue';
import VgEdit from '../views/VgEdit.vue';

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
