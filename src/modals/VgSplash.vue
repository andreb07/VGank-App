<template>
    <section id="vg-splash" :class="active ? 'modal show' : 'modal'" ref="modal">
        <div class="background" @click="close()"></div>        
        <div class="container">
            <div class="close" @click="close()">
                <svg viewBox="0 0 48 48">
                    <path d="M38 12.83l-2.83-2.83-11.17 11.17-11.17-11.17-2.83 2.83 11.17 11.17-11.17 11.17 2.83 2.83 11.17-11.17 11.17 11.17 2.83-2.83-11.17-11.17z"/>
                </svg>
            </div>
            <img class="main" :src="AppData.translations.splash_background" />
            <div class="buttons">
                <div class="button" v-for="button in AppData.translations.splash_buttons" :key="button">
                    <a target="_blank" :href="button.url">
                        <img :src="button.image" />
                    </a>
                </div>
            </div>
        </div>        
    </section>
</template>

<script>
import { mapGetters } from 'vuex';
import { Storage } from '@capacitor/storage';

export default {

    data() { return { 
        active: false
    }},

    computed: {
        ...mapGetters([ 'AppData' ]),
    
    },

    methods: {
        
        init: async function(){

            const vganksplash = await Storage.get({ key: 'vganksplash' });
            if(!this.AppData.translations.splash_active || this.$isMobile() || vganksplash.value) return;
            
            let view = this;
            let delay = this.AppData.translations.splash_delay ? this.AppData.translations.splash_delay : 2000;

            setTimeout(function(){
                view.active = true;
            }, delay);
            
        },

        close: async function(){
            await Storage.set({key: 'vganksplash',value: true});
            this.$emit('closeModal', 'splash');
        }
    }
}
</script>

<style>

</style>