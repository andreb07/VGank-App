<template>
  <vg-loading></vg-loading>
  <vg-menu ref="menu" @closeMenu="closeMenu" @openModal="openModal"></vg-menu>  
  <vg-header ref="header" @openModal="openModal" @openMenu="openMenu" @closeMenu="closeMenu" @openFilters="openFilters" @closeFilters="closeFilters"></vg-header>
  <section id="vg-view">
    <vg-filters ref="filters" @openModal="openModal" @closeFilters="closeFilters"></vg-filters>
    <router-view name="video"></router-view>
    <router-view name="main" @openModal="openModal" @saveVideo="saveVideo"></router-view>
  </section>
  <vg-champions ref="champions" @closeModal="closeModal"></vg-champions>
  <vg-ranks ref="ranks" @closeModal="closeModal"></vg-ranks>
  <vg-roles ref="roles" @closeModal="closeModal"></vg-roles>
  <vg-sources ref="sources" @closeModal="closeModal"></vg-sources>
  <vg-tags ref="tags" @closeModal="closeModal"></vg-tags>
  <vg-signin ref="signin" @closeModal="closeModal"></vg-signin>
  <vg-reported ref="reported" @closeModal="closeModal"></vg-reported>
  <vg-refresh ref="refresh" v-if="this.$route.name == 'Homepage'"></vg-refresh>
  <vg-cookies></vg-cookies>
</template>

<script>
import VgHeader from "./components/VgHeader.vue";
import VgCookies from "./components/VgCookies.vue";
import VgMenu from "./components/VgMenu.vue";
import VgLoading from "./components/VgLoading.vue";
import VgFilters from "./components/VgFilters.vue";
import VgChampions from "./modals/VgChampions.vue";
import VgRoles from "./modals/VgRoles.vue";
import VgRanks from "./modals/VgRanks.vue";
import VgSources from "./modals/VgSources.vue";
import VgTags from "./modals/VgTags.vue";
import VgSignin from "./modals/VgSignin.vue";
import VgReported from "./modals/VgReported.vue";
import VgRefresh from "./components/VgRefresh.vue";
import { mapActions, mapGetters } from "vuex";
import axios from 'axios';
import { useHead } from "@vueuse/head";

export default {
  components: { VgHeader, VgLoading, VgFilters, VgChampions, VgRanks, VgRoles, VgSources, VgTags, VgSignin, VgMenu, VgCookies, VgReported, VgRefresh},

  data() { return { 
    loaded: false, 
    callingVideos: false,
    savedScrollPosition: 0,
    currentModal:null,
    debug:true
  }},

  created: async function () {

    useHead({
      title: () => this.AppData.translations.site_title,
      meta: [
        { name: 'description',content: () => this.AppData.translations.site_description},
        { property: "og:title", content: () => this.AppData.translations.site_title },
        { property: "og:url", content: () => this.AppUrl },
        { property: "og:description", content: () => this.AppData.translations.site_description },
        { property: "og:image:secure", content: () => this.AppData.translations.share_image_facebook },
        { name: 'twitter:title',content: () => this.AppData.translations.site_title },
        { name: 'twitter:description',content: () => this.AppData.translations.site_description + ' - ' + this.AppUrl },
        { name: 'twitter:image',content: () => this.AppData.translations.share_image_twitter },
      ],
    })

    await this.fecthInitialData();   
    await this.getUserData();

    if(this.AppUser) {
      await this.getReportedVideos();
    }

    this.loaded = true;
  },

  mounted: function(){
    window.addEventListener("scroll", this.onScroll);
    window.addEventListener("resize", this.onResize);
  },

  computed: {
    ...mapGetters(['AppLoaded', 'AppUser', 'AppApi', 'AppQuery', 'AppVideos', 'AppUntagged', 'AppData', 'AppUrl']),
  },

  methods: {
    ...mapActions(['fecthInitialData', 'getUserData', 'setFavoritesList', 'updatePage', 'addVideos', 'setUntaggedList', 'changeEditingModal', 'setReportedList', 'getReportedVideos', 'addReportedVideo', 'updateFilters']),

    configViews: async function(view){

      console.log('##### CONFIG VIEW: ' + view);

      let vgapp =  document.getElementById("vg-app");
      vgapp.classList.remove(...vgapp.classList);
      vgapp.classList.add(view.toLowerCase());

      if(screen.orientation) {
        screen.orientation.lock('portrait').catch(function(error) {
          if(!error) window.screen.orientation.lock('portrait');
        });
      }     

      switch(view) {
        case 'Favorites':
          if(this.AppUser) {      
            document.getElementById("vg-loading").classList.add('show', 'notransition');     
            let response = await axios.post(this.AppApi.getFavorites, {uid: this.AppUser.ID});
            this.setFavoritesList(response.data.favorites);            
            this.showViews();
          } else {
            this.$router.replace({path: '/'});
          }
        break;
        case 'Untagged':
           if(this.AppUser) {      
            document.getElementById("vg-loading").classList.add('show', 'notransition');     
            let response = await axios.post(this.AppApi.getUntagged);
            this.setUntaggedList(response.data.videos); 
            this.showViews();
          } else {
            this.$router.replace({path: '/'});
          }
        break;
        case 'Reported':
           if(this.AppUser) {      
            this.showViews();
          } else {
            this.$router.replace({path: '/'});
          }
        break;
        case 'Video':
          // eslint-disable-next-line
          gtag('event', 'view_video');
          document.getElementById("vg-filters").classList.remove('hideclose');
          document.getElementById("vg-app").classList.add("fixed");
          this.showViews();
        break;
        case 'Homepage':        
          document.getElementById("vg-filters").classList.add('hideclose');
          this.showViews();
        break;
        case 'Edit':
          if(!this.AppUser.istagger) {
            this.$router.replace('/');
          } else {
            this.showViews();
          }
        break;
        default:
          this.showViews();
        break;
      }
      window.scrollTo(0, 0);
       
    },

    showViews: function(){
      let vgloader = document.getElementById("vg-loading");
      let vgview = document.getElementById("vg-view"); 
      let vgfavorites = document.getElementById("vg-favorites"); 
      let vguntagged = document.getElementById("vg-untagged"); 
      let vgheader = document.getElementById("vg-header"); 
      vgloader.classList.remove('notransition', 'show');

      setTimeout(function(){        
        vgview.classList.add('show');
        if(vgfavorites) vgfavorites.classList.add('show');
        if(vguntagged) vguntagged.classList.add('show');
        if(vgheader) vgheader.classList.add('show');
      }, 300);      
    },

    onScroll: function () {
      console.log('onscroll', this.$route.name);

      if(this.$route.name == 'Favorites' ||
         this.$route.name == 'About' ||
         this.$route.name == 'Privacy' ||
         this.$route.name == 'Untagged' ||
         this.$route.name == 'Reported' ) return;

      let vgapp = document.getElementById("vg-app");
      let vgheader = document.getElementById("vg-header");
      let vgfilters = document.getElementById("vg-filters");
      let offsetScrollingDown = window.innerWidth < 640 ? 80 : 100;
      let offsetScrollingUp = window.innerWidth < 640 ? 80 : 175;

      if (vgheader.classList.contains("blackened")) {
        vgapp.classList.add("fixed");
        vgheader.classList.remove("blackened");
      }

      if (this.savedScrollPosition < window.top.scrollY) {
        if (window.top.scrollY > offsetScrollingDown) {
          vgapp.classList.add("fixed");
          vgfilters.classList.remove('hideclose');
        }
      } else {
        if (window.top.scrollY <= offsetScrollingUp) {
          if(this.$route.name == 'Homepage') {
            vgapp.classList.remove("fixed");
            vgfilters.classList.add('hideclose');
          }          
        }
      }

      this.savedScrollPosition = window.top.scrollY;

      if (window.innerHeight + window.top.scrollY >= document.body.offsetHeight) {
        if (!this.callingVideos) {
          this.callingVideos = true;
          this.callVideos();
        }
      }
    },

    callVideos: async function () {

      let page = this.AppQuery.page + 1;
      let loader = document.querySelector("#vg-videos #vg-loading");

      if (page > this.AppQuery.total) {
        console.log("##### NO MORE PAGES TO LOAD");
        this.callingVideos = false;
        return;
      }

      loader.classList.add("show");
      console.log("##### GET VIDEOS PAGE " + page + "/" + this.AppQuery.total);

      const response = await axios.post(this.AppApi.getVideos, { page: page, filters: this.AppQuery.filters });

      this.updatePage(page);
      this.addVideos(response.data.videos);
      this.callingVideos = false;
      loader.classList.remove("show");
    },

    openModal: function(type, data){
      console.log('OPEN MODAL FROM APP', type, data);

      this.$refs.refresh.stopRefresh = true;
      let modal = this.$refs[type].$el;
      this.currentModal = modal;
      modal.classList.add('show');

      let selected = document.querySelectorAll('.item.selected');
      for (let i = 0; i < selected.length; i++) {
        selected[i].classList.remove('selected');
      }

      if(type == 'reported') {
        this.$refs.reported.$el.classList.add('modal', 'show', data.reportedType);
        this.addReportedVideo(data.vid)
        return;
      }
      
      if(data) {
       this.configModal(modal, data.vid, data.vidtype, type);        
      }
    },

    closeModal: function(){
      console.log('CLOSING MODAL');
      this.$refs.refresh.stopRefresh = false;
      this.currentModal.classList.remove('show');
      this.currentModal.removeAttribute('vid');
      this.changeEditingModal(false);
    },

    configModal: function(modal, vid, vidtype, type) {

      modal.setAttribute('vid', vid);
      modal.setAttribute('vidtype', vidtype);

      var videos;
      var self = this;

      switch(vidtype) {
        case 'tagged': videos = this.AppVideos;
        break;
        case 'untagged': videos = this.AppUntagged;
        break;
      }      

      videos.some((video) => {
        if(video.id == vid) {

          switch(type) {
            case 'champions':

              if(video.champion && video.champion2) {
                this.$refs.champions.isMatchup = true;
                this.updateFilters({type:'champions', val:video.champion});
                this.updateFilters({type:'champion2', val:video.champion2});
                this.changeEditingModal(true);

                video.champion.some((champId) => {
                  let item = document.querySelector("[cid='"+champId+"']");
                  if(item) item.classList.add('selected');
                });

                video.champion2.some((champId) => {
                  let item = document.querySelector("[cid='"+champId+"']");
                  if(item) item.classList.add('selected');
                });

              } else if(video.champion) {
                if(video.champion.length > 0) {
                  this.changeEditingModal(true);                  
                  video.champion.some((champId) => {
                    self.updateFilters({type:'champions', val:champId});
                    let item = document.querySelector("[cid='"+champId+"']");
                    if(item) item.classList.add('selected');
                  });
                }            
              }
            break;

            case 'ranks':
              if(video.rank) {
                if(video.rank.length > 0) {
                  self.changeEditingModal(true);
                  video.rank.some((rankId) => {
                    let item = document.querySelector("[rid='"+rankId+"']");
                    if(item) item.classList.add('selected');
                  });
                }            
              }
            break;

            case 'roles':
              if(video.position) {
                if(video.position.length > 0) {
                  self.changeEditingModal(true);
                  video.position.some((posId) => {
                    let item = document.querySelector("[rid='"+posId+"']");
                    if(item) item.classList.add('selected');
                  });
                }            
              }
            break;

            case 'tags':
              if(video.tags) {
                if(video.tags.length > 0) {
                  self.changeEditingModal(true);
                  video.tags.some((tagId) => {
                    let item = document.querySelector("[tid='"+tagId+"']");
                    if(item) item.classList.add('selected');
                  });
                }            
              }
            break;

          }
        }
      });
    },

    openMenu: function(){
      this.$refs.refresh.stopRefresh = true;
      this.$refs.menu.$el.classList.add('open');
      this.$refs.header.$el.classList.add('menuopen');
    },

    openFilters: function(){
      let filters = this.$refs.filters.$el;
      let videolist = document.getElementById('vg-videos');
      this.$refs.refresh.stopRefresh = true;

      if(filters.classList.contains('open')) {
        filters.classList.remove('open');
        videolist.classList.remove('hasfilters');
        this.$refs.header.$el.classList.remove('filtersopen');
        document.body.classList.remove('hidescroll');
      } else {
        filters.classList.add('open');
        videolist.classList.add('hasfilters');
      }      
    },

    closeFilters: function(){
      let filters = this.$refs.filters.$el;
      let videolist = document.getElementById('vg-videos');
      this.$refs.header.$el.classList.remove('filtersopen');
      filters.classList.remove('open');
      if(videolist) videolist.classList.remove('hasfilters');     
      document.body.classList.remove('hidescroll');
      this.$refs.champions.isMatchup = false;
      this.updateFilters({type:'champions', val:''});
      this.updateFilters({type:'champion2', val:''});
      this.$refs.refresh.stopRefresh = false;
    },

    closeMenu: function(){
      this.$refs.refresh.stopRefresh = false;
      this.$refs.menu.$el.classList.remove('open');
      this.$refs.header.$el.classList.remove('menuopen');
      document.body.classList.remove('hidescroll');
    },

    onResize: function(){
      let ww = window.innerWidth;
      let videolist = document.getElementById('vg-videos');
      let filters = this.$refs.filters.$el;

      if(ww > 1023) {
        this.closeMenu();
         if(filters.classList.contains('open')) {
          filters.classList.remove('open');
          videolist.classList.remove('hasfilters');
          this.$refs.header.$el.classList.remove('filtersopen');
          document.body.classList.remove('hidescroll');
        }
      }
    },

    saveVideo: function(){
      this.$refs.champions.isMatchup = false;
      this.updateFilters({type:'champions', val:''});
      this.updateFilters({type:'champion2', val:''});
    }
  },

  watch: {    

    loaded() {
      this.configViews(this.$route.name);
    },

    $route : {
      handler(val) {
        this.closeMenu();
        this.configViews(val.name);
      }
    },
  },
};
</script>