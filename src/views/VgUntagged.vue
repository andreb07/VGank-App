<template>
  <section id="vg-untagged">    
    <vg-videos ref="videolist" type="untagged" @openModal="openModal"></vg-videos>
  </section>
</template>

<script>
import VgVideos from "../components/VgVideos.vue";

export default {
  components: { VgVideos },

  methods: {
    openModal: function(type, vid) {
      this.$emit('openModal', type, vid);
    }
  }
};
</script>