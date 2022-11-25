<template>
  <section id="vg-videos" class="edit">
      <div class="no-videos" v-if="AppReported.length == 0" v-html="AppData.translations.others_no_reported"></div>
      <vg-video-thumb-untagged v-for="video in AppReported" @openModal="openModal" @saveVideo="saveVideo" :key="video.id" :data="video" :type="'tagged'" :reported="true" ></vg-video-thumb-untagged>
  </section>
</template>

<script>
import VgVideoThumbUntagged from '@/components/VgVideoThumbUntagged.vue';
import { mapGetters } from 'vuex';

export default {
  components: { VgVideoThumbUntagged },

  computed: {
      ...mapGetters(['AppReported', 'AppData']),
  },

  methods: {
    openModal: function(type, vid) {
      this.$emit('openModal', type, vid);
    },

    saveVideo:function(){
      this.$emit('saveVideo');
    }
  }
};
</script>