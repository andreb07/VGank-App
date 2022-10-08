<template>
    <section id="vg-favorites">
        <div class="no-videos" v-if="AppFavorites.length == 0" v-html="AppData.translations.others_no_favorites"></div>
        <vg-video-thumb v-for="item in AppFavorites" :key="item.id" :data="item"></vg-video-thumb>
    </section>
</template>

<script>
import VgVideoThumb from '@/components/VgVideoThumb.vue';
import { mapGetters } from 'vuex';

export default {
    components: { VgVideoThumb },
    
    computed: {
        ...mapGetters(['AppFavorites', 'AppData']),
    },

    methods: {

        openVideo: function(vid){
            this.$router.push({path: '/video/' + vid});
        },

    }
};
</script>