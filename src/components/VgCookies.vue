<template>
  <section ref="cookies" id="vg-cookies-bar" class="">
    <div class="content" v-html="AppData.translations.cookie_bar"></div>   
    <div class="link" @click="$router.push({path: '/cookies'})">More information</div>  
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
        const acceptedcookies = await Storage.get({ key: 'acceptedcookies' });
        let view = this;

        if(!acceptedcookies.value) {
            setTimeout(function(){
                view.$refs.cookies.classList.add('open');
            }, 2000);
        }
        
    },

    methods: {
        setCookies: function(){
            Storage.set({key: 'acceptedcookies', value: '1'});
            this.$refs.cookies.classList.remove('open');
        }
    }

}
</script>