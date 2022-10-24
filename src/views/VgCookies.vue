<template>
    <section id="vg-about">
        <div class="content" v-html="AppData.translations.cookie_page"></div>        
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