<template>
  <section id="vg-home">    
    <vg-videos ref="videolist" type="tagged" @openModal="openModal" @resetVideos="resetVideos"></vg-videos>
  </section>
</template>

<script>
import VgVideos from "../components/VgVideos.vue";

export default {
  components: { VgVideos },

  methods: {
    openModal: function(type, vid) {
      this.$emit('openModal', type, vid);
    },

    resetVideos: function() {
      this.$emit('resetVideos');
    }
  }
};
</script>