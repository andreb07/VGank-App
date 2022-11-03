<template>
    <section id="vg-about">
        <div class="content">
          <div v-html="AppData.translations.about_content"></div>
          <div class="link" @click="$router.push({path: '/privacy'});">VGank Privacy Policy</div> 
        </div>
    </section>
</template>

<script>
import { mapGetters } from 'vuex';
import { useHead } from "@vueuse/head";

export default {

    created: function() {
      
      useHead({
        title: () => 'VGank / About',
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
        ...mapGetters(['AppData', 'AppUrl']),
    },

    methods: {

    }
};
</script>