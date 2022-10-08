<template>
  <ion-page>  
    <app-header></app-header>
    <ion-content>
        <div class="videoWrapper">
            <div class="cover" ref="cover" @click="playVideo()">
                <img :src="videodata.thumb" />
                <ion-icon slot="icon-only" :icon="playOutline" size="large"></ion-icon>
            </div>
            <!--<div class="blocker" ref="blocker" @click="pauseVideo()"></div>-->       
            <YoutubeVue3 class="player" ref="youtube" :videoid="videodata.youtube_id" @ended="onEnded" @paused="onPaused" @played="onPlayed" />
        </div>
        <ion-card-header>
            <ion-card-subtitle color="success">
            <div class="channel">{{videodata.channel}}</div>
            <div class="date">{{videodata.date}}</div>
            </ion-card-subtitle>               
            <ion-card-title v-html="videodata.description"></ion-card-title>                
        </ion-card-header> 
        <video-filters :data="videodata"></video-filters>
    </ion-content>   
   </ion-page>
</template>


<script>

import { IonPage, IonContent, IonImg, IonIcon, IonButton, IonCard, IonCardSubtitle, IonCardHeader, IonCardTitle} from '@ionic/vue';
import { mapGetters } from 'vuex';
import { YoutubeVue3 } from 'youtube-vue3'
import { playOutline, arrowBackOutline} from 'ionicons/icons';
import VideoFilters from '../components/VideoFilters.vue';
import AppHeader from '../components/VgHeader.vue';

export default {
    name: 'VideoView',

    components: {IonPage, IonContent, IonImg, IonIcon, IonButton, YoutubeVue3, IonCard, IonCardSubtitle, IonCardHeader, IonCardTitle, VideoFilters, AppHeader },

    setup() {
        return{ playOutline, arrowBackOutline }
    },

    data() { 
        return { 
            videodata: null,
            playerVars: {
                width: 640,
                height: 480,
                autoplay: 0,
                rel:0,
                controls: 0,
                modest:1
            }
        } 
    },

    computed: {
        ...mapGetters(['AppData', 'AppUser']),
        
    },

    created() {
        console.log('##### CREATED VIDEO VIEW: ' + this.$route.params.id);
        const self = this;

        this.AppData.videos.some((video) => {
            if(video.id == this.$route.params.id) {
                self.videodata = video;
            } 
        });
    },

    methods: {
        onEnded() {
            console.log("## OnEnded")
        },

        onPaused() {
            console.log("## OnPaused")
            window.screen.orientation.lock('portrait');
            //this.$refs.cover.classList.remove('hide');
        },

        onPlayed() {
            console.log("## OnPlayed")
            window.screen.orientation.unlock();
        },

        playVideo() {
            console.log('##### PLAY VIDEO');            
            this.$refs.cover.classList.add('hide');
            this.$refs.youtube.player.playVideo();
        },

        pauseVideo() {
            console.log('##### PAUSE VIDEO');            
            this.$refs.cover.classList.remove('hide');
            this.$refs.youtube.player.stopVideo();
        },

        backHome: function(){
            this.$router.replace('/home');
        }
    }
}
</script>

<style>

    .videoWrapper  {
        position: relative;
        padding-bottom: 56.25%; /* 16:9 */
        height: 0
    }

    .videoWrapper .cover {
        z-index: 1;
        position: absolute;
        width: 100%;
        transition: opacity .3s;
    }

    .videoWrapper .cover.hide {
        opacity: 0;
        pointer-events: none;
        touch-action: none;
        display: none;
    }

    .videoWrapper .cover img {
        position: relative;
        z-index: 1;
        width: 100%;
    }

    .videoWrapper .cover ion-icon  {
        position: absolute;
        left: 50%;
        top:50%;
        transform: translate(-50%,-50%);
        z-index: 2;
        zoom: 2;
    }

    .videoWrapper iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
    }

    .videoWrapper .cover {
        position: relative;
        z-index: 3;
    }

    .videoWrapper .blocker {
        position: absolute;
        left: 0;
        top:0;
        width: 100%;
        height: 100%;
        z-index: 2;
    }

    ion-card-title {
        font-size: 15px;
    }

    ion-card-header {
        padding-bottom: 0;
    }

    ion-card-subtitle {
        display: flex;
        justify-content: space-between;
    }

    ion-card-subtitle .date {
        text-align: right;
        color: #8d8d8d;;
    }

</style>