<template>
  <section ref="cookies" id="vg-cookies" class="">
      <div class="main">
            <div class="col">{{AppData.translations.cookie_bar}}</div>
            <div class="col r">
                <a v-if="AppData.translations.cookie_bar_link" href="#">{{AppData.translations.cookie_bar_link}}</a>
                <div class="bt" @click="this.setCookies()">{{AppData.translations.cookie_bar_button}}</div>
            </div>
      </div>     
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