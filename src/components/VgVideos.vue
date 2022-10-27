<template>
  <section v-if="this.videos" id="vg-videos">
    <div class="no-videos" v-if="this.videos.length == 0" v-html="AppData.translations.filter_empty"></div>

    <div v-if="this.type == 'tagged'">
       <vg-video-thumb @openModal="openModal" v-for="item in this.videos" :key="item.id" :data="item" :class="$route.params.id == item.id ? 'hide' : ''"></vg-video-thumb>
    </div>
    <div v-else>
      <vg-video-thumb-untagged @openModal="openModal" v-for="item in this.videos" :key="item.id" :data="item" :type="'untagged'"></vg-video-thumb-untagged>
    </div>

    <section id="vg-loading">
      <img class="logo" :src="logo" />
      <img class="spinner" :src="spinner" />
    </section>
  </section>
</template>
<script>
import { mapGetters } from 'vuex';
import VgVideoThumb from '@/components/VgVideoThumb.vue';
import VgVideoThumbUntagged from '@/components/VgVideoThumbUntagged.vue';

export default {

    components: { VgVideoThumb, VgVideoThumbUntagged },

    props: { type: String },

    data() {
      return {
        disabled: false,
        cols: 5,
        logo: require('@/assets/imgs/loading_logo.svg'),
        spinner: require('@/assets/imgs/loading_spinner.svg')
      }
    }, 

    computed: {
        ...mapGetters(['AppVideos', 'AppUntagged', 'AppReported', 'AppData']),

        videos: function() {
          let vids = this.AppVideos;
          if(this.type == 'untagged') vids = this.AppUntagged;
          if(this.type == 'reported') vids = this.AppReported;
          
          return vids;
        }
    },

    methods: {

      openVideo: function(vid){
        this.$router.push({path: '/video/' + vid});
      },

      openModal: function(type, data) {
        console.log('VG VIDEOS', type, data);
        this.$emit('openModal', type, data);
      }

    }
}
</script>