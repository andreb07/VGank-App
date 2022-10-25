<template>
    <section id="vg-privacy">
      <div class="content" v-html="AppData.translations.privacy_content"></div>
    </section>
</template>

<script>
import { mapGetters } from 'vuex';
import { useHead } from "@vueuse/head";

export default {

    created: function() {
      
      useHead({
        title: () => 'VGank / Privacy',
        meta: [
        { name: 'description',content: () => this.AppData.translations.site_description},
        { property: "og:title", content: () => this.AppData.translations.site_title },
        { property: "og:url", content: () => this.AppUrl },
        { property: "og:description", content: () => this.AppData.translations.site_description },
        { property: "og:image", content: () => this.AppData.translations.share_image_facebook },
        { name: 'twitter:title',content: () => this.AppData.translations.site_title },
        { name: 'twitter:description',content: () => this.AppData.translations.site_description + ' - ' + this.AppUrl },
        { name: 'twitter:image',content: () => this.AppData.translations.share_image_twitter },
      ],
      })
    }, 
  
    computed: {
        ...mapGetters(['AppData']),
    },

    methods: {

    }
};
</script>