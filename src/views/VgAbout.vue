<template>
    <section id="vg-about">
        <div class="content" v-html="AppData.translations.about_content"></div>        
    </section>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  
    computed: {
        ...mapGetters(['AppData']),
    },

    methods: {

    }
};
</script>