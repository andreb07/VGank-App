<template>
   <section id="vg-videos" class="edit">
      <vg-video-thumb-untagged v-if="video" @openModal="openModal" :key="video.id" :data="video" :type="'tagged'"></vg-video-thumb-untagged>
  </section>
</template>

<script>
import VgVideoThumbUntagged from '@/components/VgVideoThumbUntagged.vue';
import {mapGetters} from 'vuex';

export default {
  components: { VgVideoThumbUntagged },

  created: function() {
    console.log('this.$route.params.id',this.$route.params.id);
  },

  computed: {
    ...mapGetters([ 'AppVideos']),

    video: function(){
      let _video;

      this.AppVideos.some((video) => {
        if(video.id == this.$route.params.id) {
          _video = video;
        }
      });

      return _video;
    }
  },

  methods: {
    openModal: function(type, data) {
      this.$emit('openModal', type, data);
    }
  }
};
</script>