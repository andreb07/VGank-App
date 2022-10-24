<template>
  <section ref="cookies" id="vg-cookies-bar" class="">
    <div class="content" v-html="AppData.translations.cookie_bar"></div>   
    <div class="bt" @click="this.setCookies">I Accept all cookies</div> 
  </section>
</template>

<script>

import { mapGetters } from "vuex";
import { Storage } from '@capacitor/storage';

export default {

    computed: {
        ...mapGetters([ 'AppData' ]),
    },

    created: async function() {
        const cookie = await Storage.get({ key: 'vgcookies' });
        let view = this;

        console.log(cookie);

        setTimeout(function(){
            if(!cookie.value) view.$refs.cookies.classList.add('open');
        }, 2000);
        
    },

    methods: {
        setCookies: function(){
            Storage.set({key: 'vgcookies', value: true});
            this.$refs.cookies.classList.remove('open');
        }
    }

}
</script>