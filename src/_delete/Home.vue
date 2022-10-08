<template> 
  <section id="vg-home">
    
  </section>
  <!--<ion-page v-if="AppData.loaded">
       <app-header></app-header>         
       <app-nav v-if="AppUser"></app-nav>   
       <app-filters filterType="main-filters"></app-filters>
       <ion-content>   
        <ion-refresher v-if="AppListType == 'all'" slot="fixed" @ionRefresh="doRefresh($event)">
          <ion-refresher-content :pulling-icon="chevronDownCircleOutline" refreshing-spinner="circles" ref="">
          </ion-refresher-content>
        </ion-refresher>      
        <app-videos></app-videos>    
       </ion-content>
  </ion-page>-->
</template>

<script>
//import AppNav from '../components/AppNav.vue';
//import AppFilters from '../components/AppFilters.vue';
//import AppVideos from '../components/AppVideos.vue';
//import AppMenu from '../components/AppMenu.vue';
//import AppHeader from '../components/AppHeader.vue';
import {mapGetters, mapActions} from 'vuex';

export default {
  components: {},

  computed: {
    ...mapGetters(['AppData', 'AppUser', 'AppListType', 'AppList']) 
  },

  created: async function(){
    console.log('##### CREATED HOME VIEW');
    //await this.fecthInitialData();
  },

  methods: {
    ...mapActions(['fecthInitialData', 'getVideos']),

     doRefresh: async function(e) {
      await this.refreshInitialData();
      console.log('##### NEW DATA FETCHED');
      e.target.complete()
    }
  }
  
};
</script>