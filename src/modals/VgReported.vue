<template>
  <section id="vg-reported" class="modal">
       <div class="background"  @click="closeModal"></div>
       <div class="container">
              <div class="close" @click="this.$emit('closeModal');">
                  <svg viewBox="0 0 48 48">
                      <path d="M38 12.83l-2.83-2.83-11.17 11.17-11.17-11.17-2.83 2.83 11.17 11.17-11.17 11.17 2.83 2.83 11.17-11.17 11.17 11.17 2.83-2.83-11.17-11.17z"/>
                  </svg>
              </div>
            <h2>{{AppData.translations.report_title}}</h2>            
            <div class="area created" v-html="AppData.translations.reported_text_1"></div>
            <div class="area exists"  v-html="AppData.translations.reported_text_2"></div>
            <div class="bt" @click="closeModal">Close</div>
        </div>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {


    computed: {
        ...mapGetters([ 'AppApi', 'AppData']),
    },

    methods: {
         ...mapActions(['setCurrentUser']),

        closeModal: function(){
          this.$emit('closeModal');
        }
    }

}
</script>