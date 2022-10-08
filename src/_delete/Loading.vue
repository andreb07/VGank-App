<template>
    <ion-page v-if="!AppData.loaded">  
        <ion-progress-bar type="indeterminate"></ion-progress-bar>
    </ion-page>
</template>

<script>
import { IonProgressBar, IonPage, IonText } from '@ionic/vue';
import { mapActions, mapGetters } from 'vuex';
//import { Storage } from '@capacitor/storage'

export default {
    name: 'Loading',
    components: { IonProgressBar, IonPage, IonText },

    computed: {
        ...mapGetters(['AppData', 'AppUser']) 
    },

    created: async function(){
        console.log('##### CREATED LOADING VIEW');
        await this.fecthInitialData();
        await this.getVideos();
        this.$router.replace({path: '/home'});       
    },
    
    methods: {
        ...mapActions(['fecthInitialData', 'getVideos'])
    },
}
</script>

<style>

</style>